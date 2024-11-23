import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EventDate } from './event-date.entity';
import { Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

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
  @Column({ type: 'text', nullable: true })
  svg?: string;

  @Expose()
  @Column({ type: 'timestamp', nullable: true })
  ticketingStartTime?: Date;

  @Expose()
  @OneToMany(() => EventDate, (eventDate) => eventDate.event, { cascade: true })
  eventDates: EventDate[];

  @Expose()
  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
