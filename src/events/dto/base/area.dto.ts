import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AreaDto {
  @ApiProperty({
    description: 'Name of the area',
    example: 'Section A',
    type: String,
  })
  @Expose()
  @IsString()
  label: string;

  @Expose()
  // @IsInt()
  @IsOptional()
  price: number;
}
