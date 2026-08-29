import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../services/service.entity';

// One row per DAKESLIV business unit: Grooming, Events, Security, Digital.
// Also maps to an Odoo "branch" for eTIMS/accounting purposes — see
// invoicing module notes.
@Entity('business_units')
export class BusinessUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Service, (service) => service.businessUnit)
  services: Service[];
}
