import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaymentDto } from './base/payment.dto';
import { OrderDto } from './base/order.dto';

export class UpdatePaymentResponseDto {
  @Expose()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @Expose()
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;
}
