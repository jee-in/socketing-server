import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AreaDto } from '../base/area.dto';
import { SeatWithDetailsDto } from './seat-with-details.dto';
import { SeatDto } from '../base/seat.dto';

export class AreaWithSeats extends AreaDto {
  @ApiProperty({
    description: 'SVG representation of the area',
    example: '<svg>...</svg>',
    type: String,
  })
  @Expose()
  // @IsString()
  svg: string;

  @ApiProperty({
    description: 'List of seats in the area',
    type: [SeatDto],
  })
  @Expose({ groups: ['basic', 'detailed'] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatWithDetailsDto)
  seats: SeatWithDetailsDto[];
}
