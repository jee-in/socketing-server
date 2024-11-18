import { IsOptional, IsString } from 'class-validator';

export class FindAllReservationRequestDto {
  @IsString()
  @IsOptional()
  readonly eventId?: string;
}
