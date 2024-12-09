import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllOrderRequestDto {
  @ApiProperty({
    description: 'The UUID of the event reserved',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  readonly eventId?: string;

  @ApiProperty({
    description: 'Specifies if the reservation is canceled.',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  readonly isCancelled?: string;

  @ApiProperty({
    description: 'Specifies if the event date is in the past.',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  readonly isBeforeNow?: string;
}
