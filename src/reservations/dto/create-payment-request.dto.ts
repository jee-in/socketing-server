import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';

export class CreatePaymentRequestDto {
  @ApiProperty({
    description: 'The UUID of order',
    example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  })
  @IsOptional()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Method of payment',
    enum: PaymentMethod,
    example: PaymentMethod.SOCKET_PAY,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  readonly paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Total amount of payment',
    example: '150000',
  })
  @IsOptional()
  @IsInt()
  readonly totalAmount: number;

  @ApiProperty({
    description: 'event date id',
    example: '-',
  })
  @IsOptional()
  eventDateId: string;

  @ApiProperty({
    description: 'seat ids',
    example: ['-'],
    isArray: true,
  })
  @IsOptional()
  seatIds: string[];
}
