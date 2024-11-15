import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateEventRequestDto {
  @ApiPropertyOptional({
    description: 'Updated title of the event',
    example: 'Updated Music Festival',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated thumbnail URL for the event',
    example: 'https://example.com/new-thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Updated location or venue of the event',
    example: 'Updated Central Park',
  })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional({
    description: 'Updated main cast or performers of the event',
    example: 'Updated Famous Band',
  })
  @IsOptional()
  @IsString()
  cast?: string;

  @ApiPropertyOptional({
    description: 'Updated age limit for the event (if any)',
    example: 21,
  })
  @IsOptional()
  @IsInt()
  ageLimit?: number;
}
