import { Expose, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Event } from '../entities/event.entity';

export class UpdateSeatResponseDto {
  @Expose()
  id: string;

  @Expose()
  cx: number;

  @Expose()
  cy: number;

  @Expose()
  area: number;

  @Expose()
  row: number;

  @Expose()
  number: number;

  @Expose()
  @Type(() => Event)
  event: Event;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
