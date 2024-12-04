import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsOptional()
  createdAt: Date | null;

  @Expose()
  @IsOptional()
  updatedAt: Date | null;
}
