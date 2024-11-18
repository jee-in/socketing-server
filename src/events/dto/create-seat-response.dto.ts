import { Expose, Type } from 'class-transformer';
import { IsDate, IsInt, IsString } from 'class-validator';
import { EventDto } from './event.dto';

export class CreateSeatResponseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsInt()
  cx: number;

  @Expose()
  @IsInt()
  cy: number;

  @Expose()
  @IsInt()
  area: number;

  @Expose()
  @IsInt()
  row: number;

  @Expose()
  @IsInt()
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
