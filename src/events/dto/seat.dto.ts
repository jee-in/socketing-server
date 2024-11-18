import { Expose, Type } from 'class-transformer';
import { EventDto } from './event.dto';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';

export class SeatDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  cx: number;

  @Expose({ groups: ['basic', 'detailed'] })
  cy: number;

  @Expose({ groups: ['basic', 'detailed'] })
  area: number;

  @Expose({ groups: ['basic', 'detailed'] })
  row: number;

  @Expose({ groups: ['basic', 'detailed'] })
  number: number;

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
