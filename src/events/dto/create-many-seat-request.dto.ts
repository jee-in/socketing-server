import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AreaWithSeats } from './detailed/area-with-seats.dto';

export class CreateManySeatRequestDto {
  @ApiProperty({
    description: 'List of areas with their seats',
    type: [AreaWithSeats],
    example: [
      {
        label: 'VIP Section',
        price: 100000,
        svg: '<svg><circle cx="50" cy="50" r="40" /></svg>',
        seats: [
          {
            cx: 100,
            cy: 200,
            row: 1,
            number: 1,
          },
          {
            cx: 150,
            cy: 250,
            row: 1,
            number: 2,
          },
        ],
      },
      {
        label: 'General Section',
        price: 50000,
        svg: '<svg><rect width="100" height="100" /></svg>',
        seats: [
          {
            cx: 200,
            cy: 300,
            row: 2,
            number: 1,
          },
          {
            cx: 250,
            cy: 350,
            row: 2,
            number: 2,
          },
        ],
      },
    ],
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaWithSeats)
  areas: AreaWithSeats[];
}
