import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationRequestDto {
  @ApiProperty({
    description: 'The UUID of the event for the reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'The UUID of the event date for the reservation',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  eventDateId: string;

  @ApiProperty({
    description: 'The UUID of the seat being reserved',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  seatId: string;
}
