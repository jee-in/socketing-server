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
}
