import {
  Body,
  Controller,
  HttpCode,
  Patch,
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
import { PaymentsService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';
import { UpdatePaymentResponseDto } from './dto/update-payment-response.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @ApiOperation({
    summary: 'Create a payment',
    description: 'Create a payment for an order',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully created',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          user: {
            id: '4550a86f-8d98-4ab7-802a-b3f8d31412e2',
            nickname: '냉철한금빛양치기',
            email: 'jeein@jungle.com',
            profileImage: null,
            role: 'user',
          },
          order: {
            id: 'a7cb77c7-616e-45d7-82a2-8eb7990cf7ce',
            createdAt: '2024-12-01T15:44:19.209Z',
            updatedAt: '2024-12-01T15:44:19.209Z',
            deletedAt: null,
          },
          payment: {
            id: '8a0829d9-e3af-444b-8d8b-2775943a8dcd',
            createdAt: '2024-12-01T16:43:34.116Z',
            updatedAt: '2024-12-01T16:43:34.116Z',
            deletedAt: null,
            paymentAmount: '150000',
            paymentMethod: 'socket_pay',
            paymentStatus: 'pending',
            paidAt: null,
          },
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
    //
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
    @Body() body: CreatePaymentRequestDto,
    @Req() req,
  ): Promise<CommonResponse<CreatePaymentResponseDto>> {
    const { userId } = req.user;
    return this.paymentService.createPayment(body, userId);
  }

  @ApiOperation({
    summary: 'Update a payment',
    description: 'Update a payment for an order',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully updated',
    schema: {
      example: {
        code: 0,
        message: 'Success',
        data: {
          payment: {
            id: '6780b35f-5b9f-4106-a39f-f57d968a12c3',
            createdAt: '2024-12-01T16:23:12.565Z',
            updatedAt: '2024-12-01T17:35:52.069Z',
            deletedAt: null,
            paymentAmount: 0,
            paymentMethod: 'socket_pay',
            paymentStatus: 'completed',
            paidAt: null,
          },
          order: {
            id: '40818a9b-b1a6-40f7-aee8-b4a9c04ec972',
            createdAt: '2024-12-01T15:33:24.671Z',
            updatedAt: '2024-12-01T15:33:24.671Z',
            deletedAt: null,
          },
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
    //
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
  @Patch()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  update(
    @Body() body: UpdatePaymentRequestDto,
    @Req() req,
  ): Promise<CommonResponse<UpdatePaymentResponseDto>> {
    const { userId } = req.user;
    return this.paymentService.updatePayment(body, userId);
  }
}
