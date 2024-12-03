import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SeatWithDetailsDto {
  @ApiProperty({
    description: 'X-coordinate of the seat',
    example: 100,
    type: Number,
  })
  @Expose()
  cx: number;

  @ApiProperty({
    description: 'Y-coordinate of the seat',
    example: 50,
    type: Number,
  })
  @Expose()
  cy: number;

  @ApiProperty({
    description: 'Row number of the seat',
    example: 1,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  row: number;

  @ApiProperty({
    description: 'Number of the seat',
    example: 2,
    type: Number,
  })
  @Expose({ groups: ['basic', 'detailed'] })
  number: number;
}
