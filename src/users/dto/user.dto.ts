import { Expose, Type } from 'class-transformer';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';

export class UserDto {
  @Expose({ groups: ['basic', 'detailed'] })
  id: string;

  @Expose({ groups: ['basic', 'detailed'] })
  nickname: string;

  @Expose({ groups: ['basic', 'detailed'] })
  email: string;

  @Expose({ groups: ['basic', 'detailed'] })
  profileImage: string;

  @Expose({ groups: ['basic', 'detailed'] })
  role: string;

  @Expose({ groups: ['admin'] })
  password: string;

  @Expose({ groups: ['admin'] })
  salt: string;

  @Expose({ groups: ['basic', 'detailed'] })
  @Type(() => ReservationDto)
  reservations: ReservationDto[];

  @Expose({ groups: ['detailed'] })
  createdAt: Date;

  @Expose({ groups: ['detailed'] })
  updatedAt: Date;
}
