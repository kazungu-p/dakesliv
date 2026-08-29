import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IntaSend from 'intasend-node';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';
import { InvoicingService } from '../invoicing/invoicing.service';
import { FoundationService } from '../foundation/foundation.service';
import { Booking } from '../bookings/booking.entity';

const FOUNDATION_PERCENTAGE = 0.03; // 3% — confirm the real figure with the client

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  // Lazily created — see getClient(). Same reasoning as AuthService's
  // Africa's Talking client: creating this eagerly would risk crashing the
  // whole app on startup if the IntaSend keys are missing or wrong, rather
  // than failing just the one payment attempt that needs them.
  private client: IntaSend | null = null;

  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    private readonly invoicing: InvoicingService,
    private readonly foundation: FoundationService,
  ) {}

  private getClient(): IntaSend {
    const { INTASEND_PUBLISHABLE_KEY, INTASEND_SECRET_KEY } = process.env;
    if (!INTASEND_PUBLISHABLE_KEY || !INTASEND_SECRET_KEY) {
      throw new Error(
        "IntaSend isn't configured — set INTASEND_PUBLISHABLE_KEY and INTASEND_SECRET_KEY in .env.",
      );
    }
    if (!this.client) {
      // Third argument is "test mode" — true outside production so nobody
      // accidentally takes real M-Pesa payments from a dev machine.
      this.client = new IntaSend(
        INTASEND_PUBLISHABLE_KEY,
        INTASEND_SECRET_KEY,
        process.env.NODE_ENV !== 'production',
      );
    }
    return this.client;
  }

  /**
   * Starts a payment for a booking.
   *  - CASH is confirmed immediately (front-desk/admin panel only — see
   *    PaymentsController, which rejects CASH on the customer-facing route).
   *  - MPESA triggers a real STK Push via IntaSend: the customer gets a
   *    prompt on their phone, and IntaSend calls our webhook
   *    (POST /payments/webhook/intasend) once they approve or decline it —
   *    see confirm() below for what happens next.
   *  - CARD isn't wired up yet (see the TODO below).
   */
  async initiate(booking: Booking, amount: string, method: PaymentMethod): Promise<Payment> {
    const payment = this.payments.create({
      booking,
      amount,
      method,
      status: PaymentStatus.PENDING,
    });
    const saved = await this.payments.save(payment);

    if (method === PaymentMethod.CASH) {
      return this.confirm(saved.id);
    }

    if (method === PaymentMethod.MPESA) {
      try {
        const [firstName, ...rest] = (booking.user.name || 'Dakesliv Customer').split(' ');
        await this.getClient().collection().mpesaStkPush({
          first_name: firstName,
          last_name: rest.join(' ') || 'Customer',
          email: booking.user.email || undefined,
          amount: Number(amount),
          phone_number: booking.user.phone.replace('+', ''),
          // api_ref round-trips through IntaSend's webhook payload, letting
          // us match the callback back to this exact payment record.
          api_ref: saved.id,
        });
      } catch (err) {
        this.logger.error(`M-Pesa STK push failed for payment ${saved.id}`, err);
        saved.status = PaymentStatus.FAILED;
        await this.payments.save(saved);
        throw new BadGatewayException(
          'Could not start the M-Pesa payment. Please check the number and try again.',
        );
      }
      return saved; // stays PENDING until the webhook confirms it
    }

    if (method === PaymentMethod.CARD) {
      // TODO: implement IntaSend's Checkout Link API for card payments —
      // different flow (redirect-based) from the STK Push above.
      throw new Error('Card payments are not wired up yet — use M-Pesa or cash for now.');
    }

    return saved;
  }

  /**
   * Called once a payment provider (M-Pesa aggregator webhook, card gateway,
   * or a front-desk cash entry) confirms money has actually been received.
   *
   * This is the single point where the compliance chain fires:
   *   payment confirmed -> invoice created & queued for eTIMS -> foundation
   *   allocation recorded. Keeping this in one place means an online booking
   *   and an office walk-in booking go through identical compliance steps.
   */
  async confirm(paymentId: string): Promise<Payment> {
    const payment = await this.payments.findOneByOrFail({ id: paymentId });
    payment.status = PaymentStatus.CONFIRMED;
    await this.payments.save(payment);

    await this.invoicing.createFromPayment(payment);
    await this.foundation.allocateFromPayment(payment, FOUNDATION_PERCENTAGE);

    return payment;
  }

  async markFailed(paymentId: string): Promise<void> {
    await this.payments.update({ id: paymentId }, { status: PaymentStatus.FAILED });
  }

  /** For the payment page's status polling and the confirmation page. */
  findOne(paymentId: string): Promise<Payment> {
    return this.payments.findOneByOrFail({ id: paymentId });
  }
}
