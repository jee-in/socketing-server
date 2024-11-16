import { Expose, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateReservationResponseDto {
  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => EventDate)
  eventDate: EventDate;

  @Expose()
  @Type(() => Seat)
  seat: Seat;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
