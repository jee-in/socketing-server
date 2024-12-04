import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from './event.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity()
export class EventDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @ManyToOne(() => Event, (event) => event.eventDates, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Reservation, (reservation) => reservation.eventDate, {
    cascade: true,
  })
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
