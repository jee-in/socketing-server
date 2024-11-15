import { Event } from 'src/events/entities/event.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['event', 'area', 'row', 'number'])
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  cx: number;

  @Column({ type: 'int' })
  cy: number;

  @Column({ type: 'int' })
  area: number;

  @Column({ type: 'int' })
  row: number;

  @Column({ type: 'int' })
  number: number;

  @ManyToOne(() => Event, (event) => event.eventDates, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  event: Event;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
