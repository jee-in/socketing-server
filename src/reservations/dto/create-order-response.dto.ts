import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { BasicSeatWithAreaDto } from 'src/events/dto/basic-seat-with-area.dot';
import { EventDto } from 'src/events/dto/event.dto';
import { UserWithPoint } from 'src/users/dto/user-with-point.dto';

export class CreateOrderResponseDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @IsInt()
  totalAmount: number;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWithPoint)
  user: UserWithPoint;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasicSeatWithAreaDto)
  reservations: BasicSeatWithAreaDto[];
}
