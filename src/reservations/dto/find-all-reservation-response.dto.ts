import { Expose, Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';

export class FindAllReservationResponseDto {
  @Expose({ groups: ['basic', 'detailed'] })
  @IsString()
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => User)
  user: UserDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDate)
  eventDate: EventDateDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => Seat)
  seat: SeatDto;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  @IsDate()
  updatedAt: Date;
}
