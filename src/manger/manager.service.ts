import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';
import { Area } from 'src/events/entities/area.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(
    userId: any,
    eventId: string,
    eventDateId: string,
  ): Promise<CommonResponse<any>> {
    console.log(userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    if (user.role != 'admin') {
      const error = ERROR_CODES.UNAUTHORIZED;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const queryBuilder = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user')
      .leftJoinAndSelect(
        'event.eventDates',
        'eventDates',
        'eventDates.deletedAt IS NULL',
      )
      .leftJoinAndSelect('eventDates.reservations', 'reservation')
      .leftJoinAndSelect('event.areas', 'area')
      .leftJoinAndSelect('area.seats', 'areaSeats')
      .leftJoinAndSelect('reservation.seat', 'reservationSeat')
      .leftJoinAndSelect('reservation.order', 'order')
      .leftJoinAndSelect('order.payments', 'payment')
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
        'areaSeats.id',
        'areaSeats.cx',
        'areaSeats.cy',
        'areaSeats.row',
        'areaSeats.number',
        'area.label',
        'area.price',
        'area.svg',
        'reservation.id',
        'reservation.createdAt',
        'reservation.updatedAt',
        'reservation.deletedAt',
        'order.id',
        'order.createdAt',
        'order.updatedAt',
        'order.deletedAt',
        'payment.id',
        'payment.paymentAmount',
        'payment.paymentMethod',
        'payment.paymentStatus',
        'payment.paidAt',
        'payment.createdAt',
        'payment.updatedAt',
        'payment.deletedAt',
      ])
      .andWhere('event.user = :userId', { userId })
      .andWhere('event.id = :eventId', { eventId });

    if (eventDateId) {
      queryBuilder.andWhere('eventDates.id = :eventDateId', { eventDateId });
    } else {
      const earliestEventDate = await this.eventDateRepository
        .createQueryBuilder('eventDate')
        .select('eventDate.id')
        .orderBy('eventDate.date', 'ASC')
        .getOne();

      if (!earliestEventDate) {
        const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      queryBuilder.andWhere('eventDates.id = :id', {
        id: earliestEventDate.id,
      });
    }

    const event = await queryBuilder.getOne();

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    console.log(event);

    return new CommonResponse(event);
  }

  async findAll(userId: any): Promise<CommonResponse<Event[]>> {
    console.log(userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    if (user.role != 'admin') {
      const error = ERROR_CODES.UNAUTHORIZED;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

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
      .andWhere('event.user = :userId', { userId })
      .getMany();

    return new CommonResponse(events);
  }
}
