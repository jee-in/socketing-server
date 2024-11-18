import { ReservationDto } from 'src/reservations/dto/reservation.dto';
import { EventDto } from './event.dto';
import { Expose, Type } from 'class-transformer';

export class EventDateDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  date: Date;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDto)
  event: EventDto;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
