import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Customers now sign in with Google or an emailed code, so email is the
  // primary identifier. Always stored lower-cased (see AuthService).
  @Column({ type: 'varchar', unique: true, nullable: true })
  email?: string | null;

  // Google's stable account id (the `sub` claim). Set the first time the
  // customer signs in with Google, and used to recognise them afterwards
  // even if they change their Gmail address.
  @Column({ type: 'varchar', unique: true, nullable: true })
  googleId?: string | null;

  // No longer required at sign-in. Still needed for M-Pesa STK Push and is
  // how front-desk walk-in bookings find a customer — collected on the
  // payment step or via PATCH /auth/me. Postgres allows many NULLs in a
  // unique column, so customers without a phone don't collide.
  @Column({ type: 'varchar', unique: true, nullable: true })
  phone?: string | null;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
