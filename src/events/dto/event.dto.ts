import { Expose, Type } from 'class-transformer';
import { EventDateDto } from './event-date-dto';

export class EventDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  title: string;

  @Expose({ groups: ['basic', 'detailed'] })
  thumbnail: string;

  @Expose({ groups: ['basic', 'detailed'] })
  place: string;

  @Expose({ groups: ['basic', 'detailed'] })
  cast: string;

  @Expose({ groups: ['basic', 'detailed'] })
  ageLimit?: number;

  @Expose({ groups: ['detailed'] })
  svg?: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => EventDateDto)
  eventDates: EventDateDto[];

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
