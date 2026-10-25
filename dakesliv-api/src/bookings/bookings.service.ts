import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingChannel, BookingStatus } from './booking.entity';
import { User } from '../auth/user.entity';
import { Service } from '../services/service.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Service) private readonly services: Repository<Service>,
  ) {}

  async createFromIds(
    userId: string,
    serviceId: string,
    scheduledAt: Date,
    channel: BookingChannel = BookingChannel.ONLINE,
    staffId?: string,
  ): Promise<Booking> {
    const user = await this.users.findOneByOrFail({ id: userId });
    const service = await this.services.findOneByOrFail({ id: serviceId });

    const booking = this.bookings.create({
      user,
      service,
      scheduledAt,
      channel,
      staffId,
      status: BookingStatus.PENDING,
    });
    return this.bookings.save(booking);
  }

  /**
   * Front-desk flow: identifies the customer by phone number rather than
   * an internal id, finding an existing record or creating one on the
   * spot — the same way a real walk-in interaction works.
   */
  async createWalkIn(
    customerPhone: string,
    customerName: string | undefined,
    serviceId: string,
    scheduledAt: Date,
    staffId: string,
  ): Promise<Booking> {
    let user = await this.users.findOneBy({ phone: customerPhone });
    if (!user) {
      user = this.users.create({ phone: customerPhone, name: customerName || 'Walk-in customer' });
      await this.users.save(user);
    }

    const service = await this.services.findOneByOrFail({ id: serviceId });

    const booking = this.bookings.create({
      user,
      service,
      scheduledAt,
      channel: BookingChannel.WALK_IN,
      staffId,
      status: BookingStatus.PENDING,
    });
    return this.bookings.save(booking);
  }

  findOne(id: string): Promise<Booking> {
    return this.bookings.findOneByOrFail({ id });
  }

  /** Called from PaymentsService.confirm() once a payment actually clears —
   * without this, a booking's status stays PENDING forever even after
   * it's fully paid, since nothing else ever updates it. */
  async markConfirmed(id: string): Promise<void> {
    await this.bookings.update({ id }, { status: BookingStatus.CONFIRMED });
  }

  findForToday(): Promise<Booking[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Note: createQueryBuilder does NOT apply the `eager: true` relations
    // set on the entity — that only happens automatically with the
    // repository's own find()/findOne(). Every relation the caller needs
    // has to be explicitly joined here, or it comes back undefined.
    return this.bookings
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('service.businessUnit', 'businessUnit')
      .where('booking.scheduledAt BETWEEN :start AND :end', { start, end })
      .orderBy('booking.scheduledAt', 'ASC')
      .getMany();
  }

  findForUnit(businessUnitId: string): Promise<Booking[]> {
    return this.bookings
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('service.businessUnit', 'businessUnit')
      .where('service.businessUnitId = :businessUnitId', { businessUnitId })
      .getMany();
  }
}
