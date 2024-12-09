import { Expose } from 'class-transformer';
import { PlainReservationDto } from './plain-reservation-dto';
import { IsString } from 'class-validator';

export class FindOneOrderResponseDto {
  @Expose()
  @IsString()
  orderId: string;

  @Expose()
  orderCreatedAt: Date;

  @Expose()
  orderCanceledAt: Date;

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
