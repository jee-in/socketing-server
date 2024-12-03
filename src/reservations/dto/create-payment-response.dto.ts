import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDto } from 'src/users/dto/base/user.dto';
import { OrderDto } from './base/order.dto';
import { PaymentDto } from './base/payment.dto';

export class CreatePaymentResponseDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
