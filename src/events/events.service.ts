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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async findOne(id: string): Promise<CommonResponse<any>> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
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
        'event.createdAt',
        'event.updatedAt',
        'eventDates.id',
        'eventDates.date',
        'eventDates.createdAt',
        'eventDates.updatedAt',
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
        'event.createdAt',
        'event.updatedAt',
        'eventDates.id',
        'eventDates.date',
        'eventDates.createdAt',
        'eventDates.updatedAt',
      ])
      .getMany();

    return new CommonResponse(events);
  }

  async createEvent(
    createEventRequestDto: CreateEventRequestDto,
  ): Promise<CommonResponse<CreateEventResponseDto>> {
    const { title, thumbnail, place, cast, ageLimit, eventDates } =
      createEventRequestDto;

    const event = this.eventRepository.create({
      title,
      thumbnail,
      place,
      cast,
      ageLimit,
      eventDates: eventDates?.map((date) => ({ date })),
    });

    const savedEvent = await this.eventRepository.save(event);
    const eventResponse = plainToInstance(CreateEventResponseDto, savedEvent, {
      excludeExtraneousValues: true,
    });
    return new CommonResponse(eventResponse);
  }

  async updateEvent(
    id: string,
    UpdateEventRequestDto: UpdateEventRequestDto,
  ): Promise<CommonResponse<UpdateEventResponseDto>> {
    const { title, thumbnail, place, cast, ageLimit } = UpdateEventRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventDates'],
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    if (title) event.title = title;
    if (thumbnail) event.thumbnail = thumbnail;
    if (place) event.place = place;
    if (cast) event.cast = cast;
    if (ageLimit !== undefined) event.ageLimit = ageLimit;

    const updatedEvent = await this.eventRepository.save(event);
    const eventResponse = plainToInstance(
      UpdateEventResponseDto,
      updatedEvent,
      {
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
}
