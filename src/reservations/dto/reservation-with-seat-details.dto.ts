import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BasicSeatWithAreaDto } from 'src/events/dto/basic-seat-with-area.dot';

export class ReservationWithSeatDetailsDto {
  @Expose()
  id: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasicSeatWithAreaDto)
  reservations: BasicSeatWithAreaDto[];
}
