import { User } from 'src/users/entities/user.entity';
import { Reservation } from './reservation.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';

/* migration) 일단 not null 유지 */
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reservations: Reservation[];

  @OneToMany(() => Payment, (payment) => payment.order, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  payments: Payment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
