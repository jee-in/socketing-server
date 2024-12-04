import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ManagersService } from './manager.service';

@ApiTags('Managers')
@Controller('managers/events')
export class ManagersController {
  constructor(private readonly managerService: ManagersService) {}

  @ApiOperation({ summary: 'Retrieve a specific event by ID' })
  @ApiResponse({
    status: 200,
    description: 'The event details.',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {},
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
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') eventId: string,
    @Query('eventDateId') eventDateId: string,
    @Req() req: any,
  ): Promise<CommonResponse<any>> {
    console.log(req.user);
    const { userId } = req.user;
    return this.managerService.findOne(userId, eventId, eventDateId);
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
            ticketingStartTime: '2024-11-23T19:00:00.000Z',
            createdAt: '2024-11-14T23:22:01.274Z',
            updatedAt: '2024-11-14T23:22:01.274Z',
            user: {
              id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
              nickname: 'new_nickname',
              email: 'se1620236@naver.com',
              profileImage: null,
              role: 'user',
            },
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
            ticketingStartTime: '2024-11-23T19:00:00.000Z',
            createdAt: '2024-11-14T23:22:24.170Z',
            updatedAt: '2024-11-14T23:22:24.170Z',
            user: {
              id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
              nickname: 'new_nickname',
              email: 'se1620236@naver.com',
              profileImage: null,
              role: 'user',
            },
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
  @ApiBearerAuth()
  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any): Promise<CommonResponse<any>> {
    console.log(req.user);
    const { userId } = req.user;
    return this.managerService.findAll(userId);
  }

  // @ApiOperation({
  //   summary: 'Get seat reservation status for an event',
  //   description:
  //     'Fetches the reservation status for all seats in a specific event. Optionally filters by eventDateId.',
  // })
  // @ApiQuery({
  //   name: 'eventDateId',
  //   required: false,
  //   type: String,
  //   description: 'The ID of the event date to filter by.',
  // })
  // @ApiParam({
  //   name: 'eventId',
  //   required: true,
  //   type: String,
  //   description: 'The ID of the event to fetch seat reservation status for.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully fetched seat reservation status.',
  //   schema: {
  //     example: {
  //       code: 0,
  //       message: 'Success',
  //       data: [
  //         {
  //           id: '5b54820d-d6b8-4eea-840f-f191881198ac',
  //           cx: 100,
  //           cy: 100,
  //           area: 1,
  //           row: 1,
  //           number: 3,
  //           price: 77000,
  //           reservations: [
  //             {
  //               id: 'fc9409f1-bbc9-44d1-8f53-e00d4964e9d2',
  //               eventDate: {
  //                 id: 'aad8e60c-7973-40c6-b53e-335ac03a2af0',
  //                 date: '2024-12-02T19:00:00.000Z',
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Token is invalid or missing',
  //   schema: {
  //     example: {
  //       code: 8,
  //       message: 'Unauthorized',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Event not found.',
  //   schema: {
  //     example: {
  //       code: 9,
  //       message: 'Event not found',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   schema: {
  //     example: {
  //       code: 6,
  //       message: 'Internal server error',
  //     },
  //   },
  // })
  // @ApiBearerAuth()
  // @Get(':eventId/seats-status')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // findAllSeatStatus(
  //   @Param('eventId') eventId: string,
  //   @Query('eventDateId') eventDateId: string,
  // ) {
  //   return this.eventService.findAllSeatStatus(eventId, eventDateId);
  // }

  // @ApiOperation({
  //   summary: 'Get reservation status for a specific seat in an event',
  //   description:
  //     'Fetches the reservation status for a specific seat in a specific event. Includes reservation details if applicable.',
  // })
  // @ApiParam({
  //   name: 'eventId',
  //   required: true,
  //   type: String,
  //   description: 'The ID of the event to fetch seat reservation status for.',
  //   example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  // })
  // @ApiParam({
  //   name: 'seatId',
  //   required: true,
  //   type: String,
  //   description: 'The ID of the seat to fetch reservation status for.',
  //   example: '5b54820d-d6b8-4eea-840f-f191881198ac',
  // })
  // @ApiQuery({
  //   name: 'eventDateId',
  //   required: false,
  //   type: String,
  //   description: 'The ID of the event date to filter by.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully fetched seat reservation status.',
  //   schema: {
  //     example: {
  //       code: 0,
  //       message: 'Success',
  //       data: {
  //         id: '5b54820d-d6b8-4eea-840f-f191881198ac',
  //         cx: 100,
  //         cy: 100,
  //         area: 1,
  //         row: 1,
  //         number: 3,
  //         price: 77000,
  //         reservations: [
  //           {
  //             id: 'fc9409f1-bbc9-44d1-8f53-e00d4964e9d2',
  //             eventDate: {
  //               id: 'aad8e60c-7973-40c6-b53e-335ac03a2af0',
  //               date: '2024-12-02T19:00:00.000Z',
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized - Token is invalid or missing',
  //   schema: {
  //     example: {
  //       code: 8,
  //       message: 'Unauthorized',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Seat not found for the specified event',
  //   schema: {
  //     example: {
  //       code: 11,
  //       message: 'Seat not found for the specified event',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Internal server error',
  //   schema: {
  //     example: {
  //       code: 6,
  //       message: 'Internal server error',
  //     },
  //   },
  // })
  // @ApiBearerAuth()
  // @Get(':eventId/seats-status/:seatId')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // findOneSeatStatus(
  //   @Param('eventId') eventId: string,
  //   @Param('seatId') seatId: string,
  //   @Query('eventDateId') eventDateId: string,
  // ) {
  //   return this.eventService.findOneSeatStatus(eventId, seatId, eventDateId);
  // }
}
