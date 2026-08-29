import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from '../payments/payment.entity';

export enum FoundationCategory {
  SCHOLARSHIPS = 'scholarships',
  SCHOOL_SUPPLIES = 'school_supplies',
  MENTORSHIP = 'mentorship',
  FEEDING = 'feeding',
  COUNSELLING = 'counselling',
}

// The percentage set aside for the DAKESLIV Foundation from every completed
// payment. Powers the public "Impact" page running totals.
@Entity('foundation_allocations')
export class FoundationAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payment, { eager: true })
  payment: Payment;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: FoundationCategory })
  category: FoundationCategory;

  @CreateDateColumn()
  createdAt: Date;
}
