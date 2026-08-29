import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Service } from '../services/service.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// How the booking was created — matters for reporting and for the front-desk
// walk-in flow discussed for the admin panel.
export enum BookingChannel {
  ONLINE = 'online',
  WALK_IN = 'walk_in',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Service, { eager: true })
  service: Service;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: BookingChannel, default: BookingChannel.ONLINE })
  channel: BookingChannel;

  // Set only for walk-in bookings created from the admin panel.
  @Column({ nullable: true })
  staffId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
