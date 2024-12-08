import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
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
import { OrdersService } from './orders.service';
import { FindAllOrderRequestDto } from './dto/find-all-order-request.dto';
import { FindAllOrderResponseDto } from './dto/find-all-order-response.dto';
import { FindOneOrderResponseDto } from './dto/find-one-order-response.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  // @ApiOperation({
  //   summary: 'Create an order',
  //   description: 'Create an order for one or more reservations(tickets)',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Order successfully created',
  //   schema: {
  //     example: {
  //       code: 0,
  //       message: 'Success',
  //       data: {
  //         id: '11842857-0a7e-4221-9288-c4c72a0c4d44',
  //         createdAt: '2024-12-01T16:12:01.554Z',
  //         totalAmount: 30000,
  //         user: {
  //           nickname: '냉철한금빛양치기',
  //           email: 'jeein@jungle.com',
  //           profileImage: 'https://profile.jpg',
  //           role: 'user',
  //         },
  //         event: {
  //           title: '최지인 테스트',
  //           thumbnail:
  //             'https://swjungle.net/static/hub/images/kaist_jungle_logo.png',
  //           place: '카이스트 문지캠퍼스 강의동 407호',
  //           cast: '정글 9기',
  //           ageLimit: 12,
  //           ticketingStartTime: '2024-11-30T09:54:00.000Z',
  //         },
  //         reservations: [
  //           {
  //             id: 'f2fa89f1-7474-452e-bfe5-a14832aa6c7f',
  //             seat: {
  //               row: 9,
  //               number: 2,
  //               area: {
  //                 label: 'A',
  //                 price: 30000,
  //               },
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
  //   status: 409,
  //   description: 'The seat is already reserved for the selected event date',
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
  // @Post()
  // @HttpCode(201)
  // @UseGuards(JwtAuthGuard)
  // create(
  //   @Body() body: CreateOrderRequestDto,
  //   @Req() req,
  // ): Promise<CommonResponse<CreateOrderResponseDto>> {
  //   const { userId } = req.user;
  //   return this.orderService.createOrder(body, userId);
  // }

  @ApiOperation({
    summary: 'Get All orders',
    description: 'Get all orders that user have reserved',
  })
  @ApiResponse({
    status: 201,
    description: 'Orders successfully found',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: [
          {
            orderId: '51733a36-83ac-4bb7-9a3b-bfc04ea1a65c',
            orderCreatedAt: '2024-12-03T15:02:54.255Z',
            userId: '477a51da-69f0-459f-ad7a-810623a32cdb',
            userNickname: '찬란한무지개고양이',
            userEmail: 'jeein@jungle.com',
            userProfileImage: null,
            userRole: 'user',
            eventDateId: 'c89abe90-fc33-47bf-bdc8-48a2dc5c767d',
            eventDate: '2024-12-10T05:17:00.000Z',
            eventTitle: '콜드 플레이 내한 공연',
            eventThumbnail: 'https://image.jpg',
            eventPlace: '잠실 실내 경기장',
            eventCast: '콜드 플레이',
            eventAgeLimit: 12,
            reservations: [
              {
                seatId: 'd18a9cbc-3ded-4513-8390-cb758eeef60a',
                seatCx: 516,
                seatCy: 76,
                seatRow: 2,
                seatNumber: 1,
                seatAreaId: '659a8a7b-7551-4fef-ac40-05042feca06c',
                seatAreaLabel: 'A',
                seatAreaPrice: 50000,
              },
            ],
          },
        ],
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
  @ApiBearerAuth()
  @Get()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() findAllOrderRequestDto: FindAllOrderRequestDto,
    @Req() req,
  ): Promise<CommonResponse<FindAllOrderResponseDto[]>> {
    const { userId } = req.user;
    return this.orderService.findAll(findAllOrderRequestDto, userId);
  }

  @ApiOperation({
    summary: 'Get one order',
    description: 'Get one order that user have reserved',
  })
  @ApiResponse({
    status: 201,
    description: 'An Order successfully found',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          orderId: '51733a36-83ac-4bb7-9a3b-bfc04ea1a65c',
          orderCreatedAt: '2024-12-03T15:02:54.255Z',
          userId: '477a51da-69f0-459f-ad7a-810623a32cdb',
          userNickname: '찬란한무지개고양이',
          userEmail: 'jeein@jungle.com',
          userProfileImage: null,
          userRole: 'user',
          eventDateId: 'c89abe90-fc33-47bf-bdc8-48a2dc5c767d',
          eventDate: '2024-12-10T05:17:00.000Z',
          eventTitle: '배치 테스트',
          eventThumbnail: 'https://image.jpg',
          eventPlace: '잠실 고척돔',
          eventCast: '넬',
          eventAgeLimit: 12,
          reservations: [
            {
              seatId: 'd18a9cbc-3ded-4513-8390-cb758eeef60a',
              seatCx: 516,
              seatCy: 76,
              seatRow: 2,
              seatNumber: 1,
              seatAreaId: '659a8a7b-7551-4fef-ac40-05042feca06c',
              seatAreaLabel: 'A',
              seatAreaPrice: 50000,
            },
          ],
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
  @ApiBearerAuth()
  @Get(':orderId')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('orderId') orderId: string,
    @Req() req,
  ): Promise<CommonResponse<FindOneOrderResponseDto>> {
    const { userId } = req.user;
    return this.orderService.findOne(orderId, userId);
  }

  // @ApiOperation({
  //   summary: 'Cancel one order',
  //   description: 'Cancel one order that user have reserved',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'An Order successfully canceled',
  //   schema: {
  //     example: {
  //       code: 0,
  //       message: 'Success',
  //       data: {},
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
  // @Post(':orderId/cancel')
  // @HttpCode(201)
  // @UseGuards(JwtAuthGuard)
  // cancel(
  //   @Param('orderId') orderId: string,
  //   @Req() req,
  // ): Promise<CommonResponse<any>> {
  //   const { userId } = req.user;
  //   return this.orderService.cancelOne(orderId, userId);
  // }
}
