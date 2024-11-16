import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateReservationResponseDto } from './dto/create-reservation-response.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @ApiOperation({
    summary: 'Create a reservation',
    description:
      'Create a reservation for a specific event, event date, and seat.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          user: {
            id: 'f55235ae-4496-4982-9b0d-24ec3a61d438',
            nickname: 'new_nickname',
            email: 'se1620236@naver.com',
            profileImage: null,
            createdAt: '2024-11-13T01:05:48.901Z',
            updatedAt: '2024-11-13T01:43:28.935Z',
          },
          eventDate: {
            id: '016d3b2c-31b3-408a-a8df-a77b8777b0a3',
            date: '2024-12-01T19:00:00.000Z',
            event: {
              id: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
              title: 'Music Festival',
              thumbnail: 'https://example.com/thumbnail.jpg',
              place: 'Central Park',
              cast: 'Famous Band',
              ageLimit: 18,
              svg: null,
              createdAt: '2024-11-14T23:22:01.274Z',
              updatedAt: '2024-11-14T23:22:01.274Z',
            },
            createdAt: '2024-11-14T23:22:01.274Z',
            updatedAt: '2024-11-14T23:22:01.274Z',
          },
          seat: {
            id: '5b54820d-d6b8-4eea-840f-f191881198ac',
            cx: 100,
            cy: 100,
            area: 1,
            row: 1,
            number: 3,
            createdAt: '2024-11-15T22:35:47.251Z',
            updatedAt: '2024-11-15T22:35:47.251Z',
          },
          createdAt: '2024-11-16T09:28:00.874Z',
          updatedAt: '2024-11-16T09:28:00.874Z',
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
    status: 409,
    description: 'The seat is already reserved for the selected event date',
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
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createReservationRequestDto: CreateReservationRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreateReservationResponseDto>> {
    const { userId } = req.user;
    return this.reservationService.createReservation(
      createReservationRequestDto,
      userId,
    );
  }
}
