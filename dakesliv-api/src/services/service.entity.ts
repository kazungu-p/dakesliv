import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessUnit } from '../business-units/business-unit.entity';

// A single bookable service, e.g. "Bridal package" under Grooming & Wellness,
// or "VIP protection" under Security. One table for all four units, kept
// generic on purpose — see the docx/schema discussion for why.
@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BusinessUnit, (unit) => unit.services, { eager: true })
  businessUnit: BusinessUnit;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column()
  durationMinutes: number;
}
