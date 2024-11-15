import { Expose } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventDate } from '../entities/event-date.entity';

export class UpdateEventResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Updated title of the event',
    example: 'Updated Music Festival',
  })
  @Expose()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Updated thumbnail URL for the event',
    example: 'https://example.com/new-thumbnail.jpg',
  })
  @Expose()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    description: 'Updated location or venue of the event',
    example: 'Updated Central Park',
  })
  @Expose()
  @IsString()
  place: string;

  @ApiProperty({
    description: 'Updated main cast or performers of the event',
    example: 'Updated Famous Band',
  })
  @Expose()
  @IsString()
  cast: string;

  @ApiPropertyOptional({
    description: 'Updated age limit for the event (if any)',
    example: 21,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  ageLimit?: number;

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
