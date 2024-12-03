import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: 'The UUID of the event for the reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  eventId: string;

  @ApiProperty({
    description: 'The UUID of the event date for the reservation',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  eventDateId: string;

  @ApiProperty({
    description: 'The UUID list of the seats being reserved',
    example: [
      '323e4567-e89b-12d3-a456-426614174002',
      '323e4567-e89b-12d3-a456-426614174003',
    ],
    isArray: true,
  })
  @IsArray()
  seatIds: string[];
}
