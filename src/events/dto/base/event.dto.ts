import { Expose } from 'class-transformer';

export class EventDto {
  @Expose()
  title: string;

  @Expose()
  thumbnail: string;

  @Expose()
  place: string;

  @Expose()
  cast: string;

  @Expose()
  ageLimit?: number;

  @Expose()
  svg?: string;

  @Expose()
  ticketingStartTime?: Date;
}
