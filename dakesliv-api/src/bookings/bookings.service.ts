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

  findOne(id: string): Promise<Booking> {
    return this.bookings.findOneByOrFail({ id });
  }
  findForToday(): Promise<Booking[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.bookings
      .createQueryBuilder('booking')
      .where('booking.scheduledAt BETWEEN :start AND :end', { start, end })
      .orderBy('booking.scheduledAt', 'ASC')
      .getMany();
  }

  findForUnit(businessUnitId: string): Promise<Booking[]> {
    return this.bookings
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .where('service.businessUnitId = :businessUnitId', { businessUnitId })
      .getMany();
  }
}
