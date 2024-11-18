import { Expose, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { EventDto } from './event.dto';

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
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
