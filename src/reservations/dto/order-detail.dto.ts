import { Expose, Type } from 'class-transformer';
import { AreaDto } from 'src/events/dto/base/area.dto';
import { SeatDto } from 'src/events/dto/base/seat.dto';

export class OrderDetailDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose()
  @Type(() => AreaDto)
  area: AreaDto;

  @Expose()
  createdAt: Date;
}
