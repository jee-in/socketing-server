import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';

export class CreatePaymentRequestDto {
  @ApiProperty({
    description: 'The UUID of order',
    example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Method of payment',
    enum: PaymentMethod,
    example: PaymentMethod.SOCKET_PAY,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  readonly paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Total amount of payment',
    example: '150000',
  })
  @IsNotEmpty()
  @IsInt()
  readonly totalAmount: number;
}
