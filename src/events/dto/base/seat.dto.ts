import { Expose, Type } from 'class-transformer';
import { AreaDto } from './area.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SeatDto {
  @ApiProperty({
    description: 'X-coordinate of the seat',
    example: 100,
    type: Number,
  })
  @IsInt()
  cx: number;

  @ApiProperty({
    description: 'Y-coordinate of the seat',
    example: 50,
    type: Number,
  })
  @IsInt()
  cy: number;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 1,
    type: Number,
  })
  @Expose()
  row: number;

  @ApiProperty({
    description: 'Number of the seat',
    example: 2,
    type: Number,
  })
  @Expose()
  number: number;

  @ApiProperty({
    description: 'Area information for the seat',
    type: () => AreaDto,
  })
  @Expose()
  @Type(() => AreaDto)
  area: AreaDto;
}
