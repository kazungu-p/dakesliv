import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { Payment } from '../payments/payment.entity';
import { OdooClient } from './odoo-client';

const VAT_RATE = 0.16; // Kenya standard VAT rate — confirm DAKESLIV's registration status

@Injectable()
export class InvoicingService {
  private readonly logger = new Logger(InvoicingService.name);
  // Lazily created — same reasoning as the Africa's Talking and IntaSend
  // clients elsewhere: a missing/wrong Odoo credential should fail just
  // the one invoice transmission, not crash the whole app on startup.
  private odoo: OdooClient | null = null;

  constructor(@InjectRepository(Invoice) private readonly invoices: Repository<Invoice>) {}

  private getOdoo(): OdooClient {
    const { ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY } = process.env;
    if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_API_KEY) {
      throw new Error(
        "Odoo isn't configured — set ODOO_URL, ODOO_DB, ODOO_USERNAME and ODOO_API_KEY in .env.",
      );
    }
    if (!this.odoo) {
      this.odoo = new OdooClient(ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY);
    }
    return this.odoo;
  }

  /**
   * Creates a local invoice record, then hands off to Odoo to generate the
   * actual KRA-compliant invoice through its eTIMS/OSCU module.
   *
   * kraControlNumber and qrCodeUrl stay null until Odoo confirms
   * transmission — see transmitToOdoo() below and the retry queue note.
   */
  async createFromPayment(payment: Payment): Promise<Invoice> {
    const vatAmount = (parseFloat(payment.amount) * VAT_RATE).toFixed(2);

    const invoice = this.invoices.create({
      payment,
      vatAmount,
      status: InvoiceStatus.PENDING_ETIMS,
    });
    await this.invoices.save(invoice);

    // Fire-and-forget: the client already has their booking confirmation:
    // eTIMS transmission shouldn't block that. Any invoice left in
    // PENDING_ETIMS should be picked up by a scheduled retry job — not yet
    // built, see findPendingRetries() below, which is what that job would
    // query.
    this.transmitToOdoo(invoice).catch((err) =>
      this.logger.error(`eTIMS transmission failed for invoice ${invoice.id}`, err),
    );

    return invoice;
  }

  private async transmitToOdoo(invoice: Invoice): Promise<void> {
    const { ODOO_VAT_TAX_ID } = process.env;
    if (!ODOO_VAT_TAX_ID) {
      throw new Error('ODOO_VAT_TAX_ID is not set — find the 16% VAT tax id in Odoo Accounting → Configuration → Taxes.');
    }

    const odoo = this.getOdoo();
    const { payment } = invoice;
    const { booking } = payment;
    const { user, service } = booking;

    try {
      const partnerId = await odoo.findOrCreatePartner(user.name, user.phone, user.email);
      const odooInvoiceId = await odoo.createInvoice({
        partnerId,
        description: `${service.name} — DAKESLIV ${service.businessUnit.name}`,
        amount: parseFloat(payment.amount),
        vatTaxId: Number(ODOO_VAT_TAX_ID),
      });

      // See the TODO on OdooClient.readEtimsResult() — the field names it
      // reads are placeholders until confirmed against the real instance.
      // eTIMS transmission inside Odoo can also be asynchronous (a cron
      // job, not instant on posting), so the control number may still be
      // empty right after this call — that's expected, not a bug; a retry
      // job re-checking PENDING_ETIMS invoices covers that case.
      const { controlNumber, qrCodeUrl } = await odoo.readEtimsResult(odooInvoiceId);

      invoice.kraControlNumber = controlNumber ?? undefined;
      invoice.qrCodeUrl = qrCodeUrl ?? undefined;
      invoice.status = controlNumber ? InvoiceStatus.ISSUED : InvoiceStatus.PENDING_ETIMS;
      await this.invoices.save(invoice);
    } catch (err) {
      invoice.status = InvoiceStatus.FAILED;
      await this.invoices.save(invoice);
      throw err;
    }
  }

  /** For the admin panel: invoices still waiting on eTIMS transmission. */
  async findPendingRetries(): Promise<Invoice[]> {
    return this.invoices.find({ where: { status: InvoiceStatus.PENDING_ETIMS } });
  }
}
