import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class PlainReservationDto {
  @Expose()
  @IsString()
  reservationId: string;

  @Expose()
  @IsString()
  seatId: string;

  @Expose()
  @IsNumber()
  seatCx: number;

  @Expose()
  @IsNumber()
  seatCy: number;

  @Expose()
  @IsNumber()
  seatRow: number;

  @Expose()
  @IsNumber()
  seatNumber: number;

  @Expose()
  @IsString()
  seatAreaId: string;

  @Expose()
  @IsString()
  seatAreaLabel: string;

  @Expose()
  @IsNumber()
  seatAreaPrice: number;
}
