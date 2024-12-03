import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatus } from 'src/common/enum/payment-status';

export class UpdatePaymentRequestDto {
  @ApiProperty({
    description: 'The UUID of order',
    example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'The UUID of payment',
    example: 'ba1cdf2b-69ec-473f-a501-47a7b1e73602',
  })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiProperty({
    description: 'New payment status to be updated',
    example: PaymentStatus.COMPLETED,
    enum: PaymentStatus,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  newPaymentStatus: PaymentStatus;
}
