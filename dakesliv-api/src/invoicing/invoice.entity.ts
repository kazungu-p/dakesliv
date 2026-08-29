import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from '../payments/payment.entity';

export enum InvoiceStatus {
  PENDING_ETIMS = 'pending_etims', // created, not yet transmitted to KRA
  ISSUED = 'issued', // KRA control number received
  FAILED = 'failed', // transmission failed — retry queue
}

// One invoice per payment. kraControlNumber / qrCodeUrl stay null until
// Odoo's eTIMS/OSCU module confirms transmission to KRA — see the
// "Invoicing / eTIMS" architecture notes.
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payment, { eager: true })
  payment: Payment;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING_ETIMS })
  status: InvoiceStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  vatAmount: string;

  @Column({ nullable: true })
  buyerPin?: string;

  @Column({ nullable: true })
  kraControlNumber?: string;

  @Column({ nullable: true })
  qrCodeUrl?: string;

  @CreateDateColumn()
  issuedAt: Date;
}
