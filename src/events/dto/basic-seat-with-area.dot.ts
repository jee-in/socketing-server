import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class BasicSeatWithAreaDto {
  @Expose()
  id: number;

  @Expose()
  @IsOptional()
  cx?: number;

  @Expose()
  @IsOptional()
  cy?: number;

  @Expose()
  row: number;

  @Expose()
  number: number;

  @Expose()
  label: string;

  @Expose()
  @IsOptional()
  price?: number;
}
