import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { CreateReservationRequestDto } from './dto/create-reservation-request.dto';
import { CreateReservationResponseDto } from './dto/create-reservation-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createReservation(
    createReservationRequestDto: CreateReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateReservationResponseDto>> {
    const { eventId, eventDateId, seatId } = createReservationRequestDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const eventDate = await this.eventDateRepository.findOne({
      where: { id: eventDateId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!eventDate) {
      const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const seat = await this.seatRepository.findOne({
      where: { id: seatId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const newReservation = this.reservationRepository.create({
      user,
      eventDate,
      seat,
    });

    try {
      const savedReservation =
        await this.reservationRepository.save(newReservation);

      const reservationResponse = plainToInstance(
        CreateReservationResponseDto,
        savedReservation,
        {
          excludeExtraneousValues: true,
        },
      );

      return new CommonResponse(reservationResponse);
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const uniqueError = ERROR_CODES.EXISTING_RESERVATION;
        throw new CustomException(
          uniqueError.code,
          uniqueError.message,
          uniqueError.httpStatus,
        );
      }
      throw e;
    }
  }
}
