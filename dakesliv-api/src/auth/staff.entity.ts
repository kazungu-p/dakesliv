import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessUnit } from '../business-units/business-unit.entity';

export enum StaffRole {
  OWNER = 'owner', // group leadership — sees everything, every unit
  UNIT_MANAGER = 'unit_manager', // sees/manages one business unit only
  FRONT_DESK = 'front_desk', // walk-in bookings, no financial reporting
}

// Deliberately a separate table from `users` (customers). Staff touch
// client data and payments, so they get real email+password credentials
// here rather than the lightweight phone/OTP flow customers use — see the
// note in AuthModule. There's no public signup for this table; accounts
// are created via the seed script or by an OWNER through the admin panel.
@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: StaffRole })
  role: StaffRole;

  // Set for UNIT_MANAGER and FRONT_DESK — null for OWNER, who isn't
  // scoped to one unit.
  @ManyToOne(() => BusinessUnit, { nullable: true, eager: true })
  businessUnit?: BusinessUnit;

  @CreateDateColumn()
  createdAt: Date;
}
