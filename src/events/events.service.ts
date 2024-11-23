import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { plainToInstance } from 'class-transformer';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { UpdateEventRequestDto } from './dto/update-event-request.dto';
import { UpdateEventResponseDto } from './dto/update-event-response.dto';
import { Seat } from './entities/seat.entity';
import { CreateSeatRequestDto } from './dto/create-seat-request.dto';
import { CreateSeatResponseDto } from './dto/create-seat-response.dto';
import { UpdateSeatRequestDto } from './dto/update-seat-request.dto';
import { UpdateSeatResponseDto } from './dto/update-seat-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<CommonResponse<any>> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect(
        'event.eventDates',
        'eventDates',
        'eventDates.deletedAt IS NULL',
      )
      .select([
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'event.svg',
        'event.ticketingStartTime',
        'event.createdAt',
        'event.updatedAt',
        'eventDates.id',
        'eventDates.date',
        'eventDates.createdAt',
        'eventDates.updatedAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
      ])
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(event);
  }

  async findAll(): Promise<CommonResponse<Event[]>> {
    const events = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect(
        'event.eventDates',
        'eventDates',
        'eventDates.deletedAt IS NULL',
      )
      .select([
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'event.ticketingStartTime',
        'event.createdAt',
        'event.updatedAt',
        'eventDates.id',
        'eventDates.date',
        'eventDates.createdAt',
        'eventDates.updatedAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
      ])
      .getMany();

    return new CommonResponse(events);
  }

  async createEvent(
    createEventRequestDto: CreateEventRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateEventResponseDto>> {
    const {
      title,
      thumbnail,
      place,
      cast,
      ageLimit,
      svg,
      ticketingStartTime,
      eventDates,
    } = createEventRequestDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const event = this.eventRepository.create({
      title,
      thumbnail,
      place,
      cast,
      ageLimit,
      svg,
      ticketingStartTime,
      eventDates: eventDates?.map((date) => ({ date })),
      user,
    });

    const savedEvent = await this.eventRepository.save(event);
    const eventResponse = plainToInstance(CreateEventResponseDto, savedEvent, {
      groups: ['basic'],
      excludeExtraneousValues: true,
    });
    return new CommonResponse(eventResponse);
  }

  async updateEvent(
    id: string,
    UpdateEventRequestDto: UpdateEventRequestDto,
  ): Promise<CommonResponse<UpdateEventResponseDto>> {
    const { title, thumbnail, place, cast, ageLimit, svg, ticketingStartTime } =
      UpdateEventRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventDates'],
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    event.title = title;
    event.thumbnail = thumbnail;
    event.place = place;
    event.cast = cast;
    event.ageLimit = ageLimit;
    event.svg = svg;
    event.ticketingStartTime = ticketingStartTime;

    const updatedEvent = await this.eventRepository.save(event);
    const eventResponse = plainToInstance(
      UpdateEventResponseDto,
      updatedEvent,
      {
        groups: ['basic'],
        excludeExtraneousValues: true,
      },
    );

    return new CommonResponse(eventResponse);
  }

  async softDeleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    await this.eventRepository.softDelete(id);
  }

  async createSeat(
    eventId: string,
    createSeatRequestDto: CreateSeatRequestDto,
  ): Promise<CommonResponse<CreateSeatResponseDto>> {
    const { cx, cy, area, row, number } = createSeatRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const seat = this.seatRepository.create({
      cx,
      cy,
      area,
      row,
      number,
      event,
    });

    try {
      const savedSeat = await this.seatRepository.save(seat);
      const seatResponse = plainToInstance(CreateSeatResponseDto, savedSeat, {
        excludeExtraneousValues: true,
      });
      return new CommonResponse(seatResponse);
    } catch (e) {
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const duplicateError = ERROR_CODES.DUPLICATE_SEAT;
        throw new CustomException(
          duplicateError.code,
          duplicateError.message,
          duplicateError.httpStatus,
        );
      }
      throw e;
    }
  }

  async findAllSeats(eventId: string): Promise<CommonResponse<Seat[]>> {
    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .where('seat.eventId = :eventId', { eventId })
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.createdAt',
        'seat.updatedAt',
      ])
      .getMany();

    return new CommonResponse(seats);
  }

  async findOneSeat(
    eventId: string,
    seatId: string,
  ): Promise<CommonResponse<Seat>> {
    const seat = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.event', 'event', 'event.deletedAt IS NULL')
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.createdAt',
        'seat.updatedAt',
        'event.id',
        'event.title',
        'event.thumbnail',
        'event.place',
        'event.cast',
        'event.ageLimit',
        'event.ticketingStartTime',
        'event.createdAt',
        'event.updatedAt',
      ])
      .where('seat.id = :seatId', { seatId })
      .andWhere('event.id = :eventId', { eventId })
      .getOne();

    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(seat);
  }

  async updateSeat(
    eventId: string,
    seatId: string,
    UpdateSeatRequestDto: UpdateSeatRequestDto,
  ): Promise<CommonResponse<UpdateSeatResponseDto>> {
    const { cx, cy, area, row, number } = UpdateSeatRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
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

    seat.cx = cx;
    seat.cy = cy;
    seat.area = area;
    seat.row = row;
    seat.number = number;

    const updatedSeat = await this.seatRepository.save(seat);
    const seatResponse = plainToInstance(UpdateSeatResponseDto, updatedSeat, {
      excludeExtraneousValues: true,
    });

    return new CommonResponse(seatResponse);
  }

  async deleteSeat(eventId: string, seatId: string) {
    const seat = await this.seatRepository.findOne({
      where: { id: seatId, event: { id: eventId } },
    });

    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    await this.seatRepository.remove(seat);
  }

  async findAllSeatStatus(eventId: string, eventDateId: string) {
    const queryBuilder = this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect(
        'seat.reservations',
        'reservation',
        'reservation.deletedAt IS NULL',
      )
      .leftJoinAndSelect('reservation.eventDate', 'eventDate')
      .where('seat.eventId = :eventId', { eventId })
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.id',
        'eventDate.id',
        'eventDate.date',
      ]);

    if (eventDateId) {
      queryBuilder.andWhere(
        '(eventDate.id = :eventDateId OR :eventDateId IS NULL)',
        { eventDateId },
      );
    }

    const seats = await queryBuilder.getMany();

    return new CommonResponse(seats);
  }

  async findOneSeatStatus(
    eventId: string,
    seatId: string,
    eventDateId: string,
  ) {
    const queryBuilder = this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect(
        'seat.reservations',
        'reservation',
        'reservation.deletedAt IS NULL',
      )
      .leftJoinAndSelect('reservation.eventDate', 'eventDate')
      .where('seat.eventId = :eventId', { eventId })
      .andWhere('seat.id = :seatId', { seatId })
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'reservation.id',
        'eventDate.id',
        'eventDate.date',
      ]);

    if (eventDateId) {
      queryBuilder.andWhere(
        '(eventDate.id = :eventDateId OR :eventDateId IS NULL)',
        { eventDateId },
      );
    }

    const seats = await queryBuilder.getOne();

    if (!seats) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(seats);
  }
}
