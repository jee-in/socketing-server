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
import { Seat } from './seat.entity';
import { Event } from './event.entity';

/* allow null for migration */
@Entity()
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  label: string | null;

  @Column('int', { unsigned: true, default: 0, nullable: true })
  price: number | null;

  @Column({ type: 'text', nullable: true })
  svg: string | null;

  @ManyToOne(() => Event, (event) => event.areas, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  event: Event | null;

  @OneToMany(() => Seat, (seat) => seat.area, {
    cascade: true,
  })
  seats: Seat[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
