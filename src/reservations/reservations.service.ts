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
import { EventDateDto } from 'src/events/dto/event-date-dto';
import { SeatDto } from 'src/events/dto/seat.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { FindAllReservationRequestDto } from './dto/find-all-reservation-request.dto';
import { FindAllReservationResponseDto } from './dto/find-all-reservation-response.dto';
import { Injectable } from '@nestjs/common';

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
          groups: ['detailed'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.eventDate = plainToInstance(
        EventDateDto,
        savedReservation.eventDate,
        {
          groups: ['basic'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.seat = plainToInstance(
        SeatDto,
        savedReservation.seat,
        {
          groups: ['basic'],
          excludeExtraneousValues: true,
        },
      );

      reservationResponse.user = plainToInstance(
        UserDto,
        savedReservation.user,
        {
          groups: ['basic'],
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

  async findAllReservation(
    findAllReservationRequestDto: FindAllReservationRequestDto,
    userId: string,
  ): Promise<CommonResponse<FindAllReservationResponseDto[]>> {
    const { eventId } = findAllReservationRequestDto;

    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoinAndSelect('reservation.user', 'user')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.event', 'seatEvent')
      .andWhere('user.id = :userId', { userId });

    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }

    const reservations = await queryBuilder
      .select([
        'reservation.id',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
        'eventDate.id',
        'eventDate.date',
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.createdAt',
        'reservation.updatedAt',
      ])
      .getMany();

    return new CommonResponse(reservations);
  }

  async findOneReservation(
    reservationId: string,
    userId: string,
  ): Promise<any> {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoinAndSelect('reservation.user', 'user')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.event', 'seatEvent')
      .where('reservation.id = :reservationId', { reservationId })
      .andWhere('user.id = :userId', { userId })
      .select([
        'reservation.id',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
        'eventDate.id',
        'eventDate.date',
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.createdAt',
        'reservation.updatedAt',
      ])
      .getOne();

    if (!reservation) {
      throw new CustomException(
        ERROR_CODES.RESERVATION_NOT_FOUND.code,
        ERROR_CODES.RESERVATION_NOT_FOUND.message,
        ERROR_CODES.RESERVATION_NOT_FOUND.httpStatus,
      );
    }

    return new CommonResponse(reservation);
  }

  async softDeleteReservation(reservationId: string, userId: string) {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoin('reservation.user', 'user')
      .where('reservation.id = :reservationId', { reservationId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!reservation) {
      throw new CustomException(
        ERROR_CODES.RESERVATION_NOT_FOUND.code,
        ERROR_CODES.RESERVATION_NOT_FOUND.message,
        ERROR_CODES.RESERVATION_NOT_FOUND.httpStatus,
      );
    }

    await this.reservationRepository.softRemove(reservation);
  }
}
