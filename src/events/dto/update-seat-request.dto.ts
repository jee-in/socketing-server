import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSeatRequestDto {
  @ApiProperty({
    description: 'The x-coordinate of the seat',
    example: 10,
  })
  @IsInt()
  cx: number;

  @ApiProperty({
    description: 'The y-coordinate of the seat',
    example: 20,
  })
  @IsInt()
  cy: number;

  @ApiProperty({
    description: 'The area identifier for the seat',
    example: 1,
  })
  @IsInt()
  area: number;

  @ApiProperty({
    description: 'The row number where the seat is located',
    example: 5,
  })
  @IsInt()
  row: number;

  @ApiProperty({
    description: 'The seat number in the row',
    example: 12,
  })
  @IsInt()
  number: number;
}
