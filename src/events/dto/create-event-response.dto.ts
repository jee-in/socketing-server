import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsArray, IsDate } from 'class-validator';
import { EventDateDto } from './event-date-dto';

export class CreateEventResponseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @Expose()
  @IsString()
  place: string;

  @Expose()
  @IsString()
  cast: string;

  @Expose()
  @IsOptional()
  @IsInt()
  ageLimit?: number;

  @Expose()
  @IsOptional()
  @IsString()
  svg?: string;

  @Expose()
  @IsArray()
  @IsOptional()
  @Type(() => EventDateDto)
  eventDates?: EventDateDto[];

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
