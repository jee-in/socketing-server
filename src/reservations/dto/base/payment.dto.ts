import { Expose } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from 'src/common/enum/payment-method';
import { PaymentStatus } from 'src/common/enum/payment-status';

export class PaymentDto {
  @Expose()
  @IsOptional()
  @IsString()
  id: string | null;

  @Expose()
  @IsOptional()
  @IsInt()
  paymentAmount: number | null;

  @Expose()
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod | null;

  @Expose()
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus | null;

  @Expose()
  @IsOptional()
  paidAt?: Date | null;

  @Expose()
  @IsOptional()
  createdAt: Date | null;

  @Expose()
  @IsOptional()
  updatedAt: Date | null;
}
