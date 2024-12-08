import { User } from 'src/users/entities/user.entity';
import { Reservation } from './reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { Payment } from './payment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: 'socket_pay',
    nullable: true,
  })
  paymentMethod: PaymentMethod | null;

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

  @Column({ type: 'timestamp', nullable: true, default: null })
  canceledAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
