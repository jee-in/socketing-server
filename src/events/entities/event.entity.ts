import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { EventDate } from './event-date.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Event {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column({ nullable: true })
  thumbnail: string;

  @Expose()
  @Column()
  place: string;

  @Expose()
  @Column()
  cast: string;

  @Expose()
  @Column({ type: 'int', nullable: true })
  ageLimit?: number;

  @Expose()
  @OneToMany(() => EventDate, (eventDate) => eventDate.event, { cascade: true })
  eventDates: EventDate[];

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
