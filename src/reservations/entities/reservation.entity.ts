import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
@Index('unique_eventdate_seat_canceledat_null', ['seat', 'eventDate'], {
  where: '"canceledAt" IS NULL',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.reservations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  order: Order | null;

  @ManyToOne(() => Seat, (seat) => seat.reservations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  seat: Seat;

  @ManyToOne(() => EventDate, (eventDate) => eventDate.reservations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  eventDate: EventDate;

  @Column({ type: 'timestamp', default: null, nullable: true })
  canceledAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
