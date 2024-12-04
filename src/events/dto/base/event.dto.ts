import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class EventDto {
  @Expose()
  @IsOptional()
  @IsString()
  id?: string;

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
  @IsOptional()
  svg?: string;

  @Expose()
  @IsOptional()
  ticketingStartTime?: Date;
}
