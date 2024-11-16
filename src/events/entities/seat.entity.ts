import { Expose } from 'class-transformer';
import { Event } from 'src/events/entities/event.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['event', 'area', 'row', 'number'])
export class Seat {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'int' })
  cx: number;

  @Expose()
  @Column({ type: 'int' })
  cy: number;

  @Expose()
  @Column({ type: 'int' })
  area: number;

  @Expose()
  @Column({ type: 'int' })
  row: number;

  @Expose()
  @Column({ type: 'int' })
  number: number;

  @ManyToOne(() => Event, (event) => event.eventDates, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  event: Event;

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
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
