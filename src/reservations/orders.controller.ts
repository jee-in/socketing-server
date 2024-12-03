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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @ApiOperation({
    summary: 'Create an order',
    description: 'Create an order for one or more reservations(tickets)',
  })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          id: '11842857-0a7e-4221-9288-c4c72a0c4d44',
          createdAt: '2024-12-01T16:12:01.554Z',
          totalAmount: 30000,
          user: {
            nickname: '냉철한금빛양치기',
            email: 'jeein@jungle.com',
            profileImage: 'https://profile.jpg',
            role: 'user',
          },
          event: {
            title: '최지인 테스트',
            thumbnail:
              'https://swjungle.net/static/hub/images/kaist_jungle_logo.png',
            place: '카이스트 문지캠퍼스 강의동 407호',
            cast: '정글 9기',
            ageLimit: 12,
            ticketingStartTime: '2024-11-30T09:54:00.000Z',
          },
          reservations: [
            {
              id: 'f2fa89f1-7474-452e-bfe5-a14832aa6c7f',
              seat: {
                row: 9,
                number: 2,
                area: {
                  label: 'A',
                  price: 30000,
                },
              },
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
    @Body() body: CreateOrderRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreateOrderResponseDto>> {
    const { userId } = req.user;
    return this.orderService.createOrder(body, userId);
  }
}
