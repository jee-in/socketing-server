import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BasicSeatWithAreaDto {
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
    description: 'Area label of the seat',
    example: 2,
    type: String,
  })
  @Expose()
  label: string;
}
