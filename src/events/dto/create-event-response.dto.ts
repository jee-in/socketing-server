import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsArray, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventDate } from '../entities/event-date.entity';

export class CreateEventResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Title of the event',
    example: 'Music Festival',
  })
  @Expose()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL for the event',
    example: 'https://example.com/thumbnail.jpg',
  })
  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: 'Location or venue of the event',
    example: 'Central Park',
  })
  @Expose()
  @IsString()
  place: string;

  @ApiProperty({
    description: 'Main cast or performers of the event',
    example: 'Famous Band',
  })
  @Expose()
  @IsString()
  cast: string;

  @ApiPropertyOptional({
    description: 'Age limit for the event (if any)',
    example: 18,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  ageLimit?: number;

  @ApiPropertyOptional({
    description: 'SVG data for the event design or layout',
    example:
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>',
  })
  @Expose()
  @IsOptional()
  @IsString()
  svg?: string;

  @ApiPropertyOptional({
    description: 'List of event dates with their details',
    type: [EventDate],
    example: [
      { id: '1', date: '2024-12-01T19:00:00.000Z' },
      { id: '2', date: '2024-12-02T19:00:00.000Z' },
    ],
  })
  @Expose()
  @IsArray()
  @IsOptional()
  eventDates?: EventDate[];

  @ApiProperty({
    description: 'Creation timestamp of the event',
    example: '2024-11-15T16:00:00.000Z',
  })
  @Expose()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp of the event',
    example: '2024-11-15T16:30:00.000Z',
  })
  @Expose()
  @IsDate()
  updatedAt: Date;
}
