import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class EventDateDto {
  @Expose()
  @IsOptional()
  @IsString()
  id?: string;

  @Expose()
  date: Date;
}
