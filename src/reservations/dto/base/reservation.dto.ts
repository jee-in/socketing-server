import { Expose, Type } from 'class-transformer';
import { EventDateDto } from 'src/events/dto/base/event_date.dto';
import { SeatDto } from 'src/events/dto/base/seat.dto';

export class ReservationDto {
  @Expose()
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose()
  @Type(() => SeatDto)
  seat: SeatDto;
}
