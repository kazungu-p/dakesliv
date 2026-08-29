import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../bookings/booking.entity';

export enum PaymentMethod {
  MPESA = 'mpesa',
  CARD = 'card',
  CASH = 'cash', // walk-in / office bookings only
}

export enum PaymentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

// A confirmed payment is the single event that triggers invoice generation
// (invoicing module) and a foundation allocation (foundation module) — see
// PaymentsService.confirm().
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, { eager: true })
  booking: Booking;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  // M-Pesa/aggregator transaction reference, for reconciliation.
  @Column({ nullable: true })
  providerRef?: string;

  @CreateDateColumn()
  createdAt: Date;
}
