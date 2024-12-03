import { Expose } from 'class-transformer';
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
import { Area } from './area.entity';

@Entity()
@Unique(['area', 'row', 'number'])
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

  @ManyToOne(() => Area, (area) => area.seats, {
    onDelete: 'CASCADE',
    nullable: true /* migration */,
  })
  area: Area | null;

  @Expose()
  @Column({ type: 'int' })
  row: number;

  @Expose()
  @Column({ type: 'int' })
  number: number;

  @OneToMany(() => Reservation, (reservation) => reservation.seat, {
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
