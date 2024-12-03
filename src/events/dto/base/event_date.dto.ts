import { Expose } from 'class-transformer';

export class EventDateDto {
  @Expose()
  date: Date;
}
