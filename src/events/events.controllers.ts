import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { UpdateEventRequestDto } from './dto/update-event-request.dto';
import { UpdateEventResponseDto } from './dto/update-event-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiOperation({ summary: 'Retrieve a specific event by ID' })
  @ApiResponse({
    status: 200,
    description: 'The event details.',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          id: 'e5937a19-06cc-44aa-8bfb-4f7ede0fdcfb',
          title: 'Music Festival',
          thumbnail: 'https://example.com/thumbnail.jpg',
          place: 'Central Park',
          cast: 'Famous Band',
          ageLimit: 17,
          createdAt: '2024-11-14T22:53:15.873Z',
          updatedAt: '2024-11-15T02:27:46.812Z',
          eventDates: [
            {
              id: '2221a67e-7d4f-4f7a-be3d-082d4b28ad08',
              date: '2024-11-14T23:01:29.319Z',
              createdAt: '2024-11-14T23:01:29.319Z',
              updatedAt: '2024-11-14T23:01:29.319Z',
              deletedAt: null,
            },
            {
              id: 'd25f3657-bd42-4636-bc0f-bb6b7bc9280b',
              date: '2024-11-14T23:03:53.261Z',
              createdAt: '2024-11-14T23:03:53.261Z',
              updatedAt: '2024-11-14T23:03:53.261Z',
              deletedAt: null,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found.',
    schema: {
      example: {
        code: 9,
        message: 'Event not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string): Promise<CommonResponse<any>> {
    return this.eventService.findOne(id);
  }

  @ApiOperation({ summary: 'Retrieve all events' })
  @ApiResponse({
    status: 200,
    description: 'List of all events.',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: [
          {
            id: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
            title: 'Music Festival',
            thumbnail: 'https://example.com/thumbnail.jpg',
            place: 'Central Park',
            cast: 'Famous Band',
            ageLimit: 18,
            createdAt: '2024-11-14T23:22:01.274Z',
            updatedAt: '2024-11-14T23:22:01.274Z',
            eventDates: [
              {
                id: '016d3b2c-31b3-408a-a8df-a77b8777b0a3',
                date: '2024-12-01T19:00:00.000Z',
                createdAt: '2024-11-14T23:22:01.274Z',
                updatedAt: '2024-11-14T23:22:01.274Z',
              },
              {
                id: 'aad8e60c-7973-40c6-b53e-335ac03a2af0',
                date: '2024-12-02T19:00:00.000Z',
                createdAt: '2024-11-14T23:22:01.274Z',
                updatedAt: '2024-11-14T23:22:01.274Z',
              },
            ],
          },
          {
            id: '0bf43d9c-4a03-4c8c-a972-759dc1f19a41',
            title: 'Music Festival',
            thumbnail: 'https://example.com/thumbnail.jpg',
            place: 'Central Park',
            cast: 'Famous Band',
            ageLimit: 18,
            createdAt: '2024-11-14T23:22:24.170Z',
            updatedAt: '2024-11-14T23:22:24.170Z',
            eventDates: [
              {
                id: 'bf8e2326-65d1-47d4-b3ca-cda18a741562',
                date: '2024-12-01T19:00:00.000Z',
                createdAt: '2024-11-14T23:22:24.170Z',
                updatedAt: '2024-11-14T23:22:24.170Z',
              },
              {
                id: 'ec7fe4ec-4d16-4f11-87a9-d76eb95bb8ca',
                date: '2024-12-02T19:00:00.000Z',
                createdAt: '2024-11-14T23:22:24.170Z',
                updatedAt: '2024-11-14T23:22:24.170Z',
              },
            ],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @Get()
  @HttpCode(200)
  findAll(): Promise<CommonResponse<any>> {
    return this.eventService.findAll();
  }

  @ApiOperation({ summary: 'Create a new event' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Event create payload',
    type: CreateEventRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          id: 'd33ba96a-5d4f-4758-95b9-010334bf8523',
          title: 'Music Festival',
          thumbnail: 'https://example.com/thumbnail.jpg',
          place: 'Central Park',
          cast: 'Famous Band',
          ageLimit: 18,
          eventDates: [
            {
              id: '22e9f530-b60c-4a7b-8761-4935ff3f7d09',
              date: '2024-12-01T19:00:00.000Z',
              createdAt: '2024-11-15T03:54:34.236Z',
              updatedAt: '2024-11-15T03:54:34.236Z',
            },
            {
              id: '5d09e157-d6eb-480b-aa70-4c44f023c6ca',
              date: '2024-12-02T19:00:00.000Z',
              createdAt: '2024-11-15T03:54:34.236Z',
              updatedAt: '2024-11-15T03:54:34.236Z',
            },
          ],
          createdAt: '2024-11-15T03:54:34.236Z',
          updatedAt: '2024-11-15T03:54:34.236Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is invalid or missing',
    schema: {
      example: {
        code: 8,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createEventRequestDto: CreateEventRequestDto,
  ): Promise<CommonResponse<CreateEventResponseDto>> {
    return this.eventService.createEvent(createEventRequestDto);
  }

  @ApiOperation({ summary: 'Update an existing event' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Event update payload',
    type: UpdateEventRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully updated.',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          id: 'd33ba96a-5d4f-4758-95b9-010334bf8523',
          title: 'Music Festival',
          thumbnail: 'https://example.com/thumbnail.jpg',
          place: 'Central Park',
          cast: 'Famous Band',
          ageLimit: 18,
          eventDates: [
            {
              id: '22e9f530-b60c-4a7b-8761-4935ff3f7d09',
              date: '2024-12-01T19:00:00.000Z',
              createdAt: '2024-11-15T03:54:34.236Z',
              updatedAt: '2024-11-15T03:54:34.236Z',
            },
            {
              id: '5d09e157-d6eb-480b-aa70-4c44f023c6ca',
              date: '2024-12-02T19:00:00.000Z',
              createdAt: '2024-11-15T03:54:34.236Z',
              updatedAt: '2024-11-15T03:54:34.236Z',
            },
          ],
          createdAt: '2024-11-15T03:54:34.236Z',
          updatedAt: '2024-11-15T03:54:34.236Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is invalid or missing',
    schema: {
      example: {
        code: 8,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found.',
    schema: {
      example: {
        code: 9,
        message: 'Event not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @Put(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() UpdateEventRequestDto: UpdateEventRequestDto,
  ): Promise<CommonResponse<UpdateEventResponseDto>> {
    return this.eventService.updateEvent(id, UpdateEventRequestDto);
  }

  @ApiOperation({ summary: 'Soft delete an event by ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is invalid or missing',
    schema: {
      example: {
        code: 8,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found.',
    schema: {
      example: {
        code: 9,
        message: 'Event not found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        code: 6,
        message: 'Internal server error',
      },
    },
  })
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  softDelete(@Param('id') id: string): Promise<void> {
    return this.eventService.softDeleteEvent(id);
  }
}
