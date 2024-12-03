import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { AreaWithSeats } from './detailed/area-with-seats.dto';
import { EventDto } from './base/event.dto';

export class CreateManySeatResponseDto {
  @Expose()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}
