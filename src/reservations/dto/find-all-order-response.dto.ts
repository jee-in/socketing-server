import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { PlainReservationDto } from './plain-reservation-dto';

export class FindAllOrderResponseDto {
  @Expose()
  @IsString()
  orderId: string;

  @Expose()
  orderCreatedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  userNickname: string;

  @Expose()
  userEmail: string;

  @Expose()
  userProfileImage: string;

  @Expose()
  userRole: string;

  @Expose()
  event: string;

  @Expose()
  eventDateId: string;

  @Expose()
  eventDate: Date;

  @Expose()
  eventTitle: string;

  @Expose()
  eventThumbnail: string;

  @Expose()
  eventPlace: string;

  @Expose()
  eventCast: string;

  @Expose()
  eventAgeLimit: number;

  @Expose()
  reservations: PlainReservationDto[];
}
