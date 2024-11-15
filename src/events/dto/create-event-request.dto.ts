import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventRequestDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Music Festival',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL for the event',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: 'Location or venue of the event',
    example: 'Central Park',
  })
  @IsString()
  place: string;

  @ApiProperty({
    description: 'Main cast or performers of the event',
    example: 'Famous Band',
  })
  @IsString()
  cast: string;

  @ApiPropertyOptional({
    description: 'Age limit for the event (if any)',
    example: 18,
  })
  @IsOptional()
  @IsInt()
  ageLimit?: number;

  @ApiPropertyOptional({
    description: 'List of event dates in ISO 8601 format',
    type: [String], // Swagger에서는 Date를 String으로 표시
    example: ['2024-12-01T19:00:00.000Z', '2024-12-02T19:00:00.000Z'],
  })
  @IsArray()
  @IsOptional()
  eventDates?: Date[];
}
