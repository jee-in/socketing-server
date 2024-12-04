import { Expose, Type } from 'class-transformer';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class ReservationDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => EventDateDto)
  eventDate: EventDateDto;

  @Expose()
  @Type(() => SeatDto)
  seat: SeatDto;

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
