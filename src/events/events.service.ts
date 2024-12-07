import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';
import { plainToInstance } from 'class-transformer';
import { Seat } from './entities/seat.entity';
import { User } from 'src/users/entities/user.entity';
import { Area } from './entities/area.entity';
import { CreateSeatRequestDto } from './dto/create-seat-request.dto';
import { CreateSeatResponseDto } from './dto/create-seat-response.dto';
import { EventDto } from './dto/event.dto';
import { CreateManySeatResponseDto } from './dto/create-many-seat-response.dto';
import { UpdateSeatRequestDto } from './dto/update-seat-request.dto';
import { UpdateSeatResponseDto } from './dto/update-seat-response.dto';
import { CreateEventResponseDto } from './dto/create-event-response.dto';
import { UpdateEventRequestDto } from './dto/update-event-request.dto';
import { UpdateEventResponseDto } from './dto/update-event-response.dto';
import { CreateEventRequestDto } from './dto/create-event-request.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
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

  async findOneDetailed(id: string): Promise<CommonResponse<any>> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect('event.eventDates', 'eventDate')
      .leftJoinAndSelect('event.areas', 'area')
      .leftJoinAndSelect('area.seats', 'seat')
      .andWhere('event.id = :id', { id })
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
        'eventDate.id',
        'eventDate.date',
        'eventDate.createdAt',
        'eventDate.updatedAt',
        'area.id',
        'area.label',
        'area.price',
        'area.svg',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.row',
        'seat.number',
        'user.id',
        'user.nickname',
        'user.email',
        'user.profileImage',
        'user.role',
      ])
      .getOne();

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(event);
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

    // 자식 테이블도 soft delete하기 (1) 수동으로 (2) Entity subscriber 이용하기

    await this.eventRepository.softDelete(id);
  }

  /* deprecated */
  async createSeat(
    eventId: string,
    createSeatRequestDto: CreateSeatRequestDto,
  ): Promise<CommonResponse<CreateSeatResponseDto>> {
    const { cx, cy, row, number } = createSeatRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    try {
      /* migration code */
      const newArea = this.areaRepository.create({
        label: null,
        price: null,
        svg: null,
        event,
      });

      const savedArea = await this.areaRepository.save(newArea);
      const areaWithEvent = await this.areaRepository.findOne({
        where: { id: savedArea.id },
        relations: ['event'],
      });

      const seat = this.seatRepository.create({
        cx,
        cy,
        row,
        number,
        area: areaWithEvent,
      });
      const savedSeat = await this.seatRepository.save(seat);

      const seatResponse = plainToInstance(
        CreateSeatResponseDto,
        {
          ...savedSeat,
          area: areaWithEvent.id,
          svg: areaWithEvent.svg,
          label: areaWithEvent.label,
          price: areaWithEvent.price,
        },
        {
          excludeExtraneousValues: true,
        },
      );

      // event data가 담기는지 확인
      seatResponse.event = plainToInstance(EventDto, savedSeat.area.event, {
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

  async createManySeat(
    eventId: string,
    createManySeatRequestDto: any,
  ): Promise<CommonResponse<CreateManySeatResponseDto>> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    console.log(createManySeatRequestDto);

    const { areas } = createManySeatRequestDto;
    console.log(areas);
    // console.log('Raw areas data:', JSON.stringify(areas, null, 2));

    try {
      const savedAreas = await Promise.all(
        areas.map(async (area) => {
          const newArea = this.areaRepository.create({
            label: area.label,
            price: area.price,
            svg: area.svg,
            event,
          });

          const savedArea = await this.areaRepository.save(newArea);

          const seatEntities = area.seats.map((seat) =>
            this.seatRepository.create({
              ...seat,
              area: savedArea,
            }),
          );

          const savedSeats = await this.seatRepository.save(seatEntities);

          return {
            ...savedArea,
            seats: savedSeats,
          };
        }),
      );

      const response = plainToInstance(
        CreateManySeatResponseDto,
        {
          event,
          areas: savedAreas,
        },
        {
          excludeExtraneousValues: true,
        },
      );

      return new CommonResponse(response);
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
      .leftJoinAndSelect('seat.area', 'area')
      .leftJoinAndSelect('area.event', 'event')
      .where('area.eventId = :eventId', { eventId })
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.createdAt',
        'seat.updatedAt',
        'area.id',
        'area.label',
        'area.price',
        // 'area.svg',
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
      .leftJoinAndSelect('seat.area', 'area', 'area.deletedAt Is NULL')
      .leftJoinAndSelect('area.event', 'event', 'event.deletedAt IS NULL')
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'seat.createdAt',
        'seat.updatedAt',
        'area.id',
        'area.label',
        'area.price',
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
    const { cx, cy, row, number } = UpdateSeatRequestDto;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const seat = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.area', 'area')
      .leftJoinAndSelect('seat.event', 'event')
      .where('seat.id = :seatId', { seatId })
      .andWhere('event.id = :eventId', { eventId })
      .getOne();

    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    seat.cx = cx;
    seat.cy = cy;
    seat.row = row;
    seat.number = number;

    const updatedSeat = await this.seatRepository.save(seat);
    const seatResponse = plainToInstance(UpdateSeatResponseDto, updatedSeat, {
      excludeExtraneousValues: true,
    });

    return new CommonResponse(seatResponse);
  }

  async deleteSeat(eventId: string, seatId: string) {
    const seat = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.area', 'area')
      .leftJoinAndSelect('seat.event', 'event')
      .where('seat.id = :seatId', { seatId })
      .andWhere('event.id = :eventId', { eventId })
      .getOne();

    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    await this.seatRepository.remove(seat);
  }

  async findAllSeatStatus(eventId: string, eventDateId: string) {
    const queryBuilder = this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.area', 'area')
      .leftJoinAndSelect('area.event', 'event')
      .leftJoinAndSelect('event.eventDates', 'eventDate')
      .leftJoinAndSelect('seat.reservations', 'reservation')
      .leftJoinAndSelect('reservation.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .andWhere('event.id = :eventId', { eventId });
    if (eventDateId) {
      queryBuilder.andWhere(
        '(eventDate.id = :eventDateId OR :eventDateId IS NULL)',
        { eventDateId },
      );
    }
    const seats = await queryBuilder
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'area.id',
        'area.label',
        'area.price',
        'reservation.id',
        'order.id',
        'order.createdAt',
        'order.updatedAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.role',
        'user.profileImage',
      ])
      .getMany();

    return new CommonResponse(seats);
  }

  async findOneSeatStatus(
    eventId: string,
    seatId: string,
    eventDateId: string,
  ) {
    const queryBuilder = this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.area', 'area')
      .leftJoinAndSelect('area.event', 'event')
      .leftJoinAndSelect('event.eventDates', 'eventDate')
      .leftJoinAndSelect('seat.reservations', 'reservation')
      .leftJoinAndSelect('reservation.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
      .andWhere('seat.id = :seatId', { seatId })
      .andWhere('event.id = :eventId', { eventId });
    if (eventDateId) {
      queryBuilder.andWhere(
        '(eventDate.id = :eventDateId OR :eventDateId IS NULL)',
        { eventDateId },
      );
    }

    const seat = await queryBuilder
      .select([
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.area',
        'seat.row',
        'seat.number',
        'area.id',
        'area.label',
        'area.price',
        'reservation.id',
        'order.id',
        'order.createdAt',
        'order.updatedAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.role',
        'user.profileImage',
      ])
      .getOne();

    if (!seat) {
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(seat);
  }
}
