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
import { Expose } from 'class-transformer';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity()
export class EventDate {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @Expose()
  @ManyToOne(() => Event, (event) => event.eventDates, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Reservation, (reservation) => reservation.eventDate, {
    cascade: true,
  })
  reservations: Reservation[];

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
