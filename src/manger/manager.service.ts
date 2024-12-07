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

  async findOneEventWithSeatStatus(
    userId: any,
    eventId: string,
    eventDateId: string,
  ): Promise<CommonResponse<any>> {
    const queryBuilder = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'manager')
      .leftJoinAndSelect('event.areas', 'area')
      .leftJoinAndSelect('area.seats', 'seat')
      .leftJoinAndSelect(
        'event.eventDates',
        'eventDates',
        'eventDates.deletedAt IS NULL',
      )
      .leftJoinAndSelect('seat.reservations', 'reservation')
      .leftJoinAndSelect('reservation.order', 'order')
      .leftJoinAndSelect('order.user', 'user')
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
        // 'eventDates.id',
        // 'eventDates.date',
        // 'eventDates.createdAt',
        // 'eventDates.updatedAt',
        'manager.id',
        'manager.nickname',
        'manager.email',
        'manager.profileImage',
        'manager.role',
        'area.id',
        'area.label',
        'area.price',
        'area.svg',
        'seat.id',
        'seat.cx',
        'seat.cy',
        'seat.row',
        'seat.number',
        'reservation.id',
        'order.id',
        'order.createdAt',
        'order.updatedAt',
        'order.deletedAt',
        'user.id',
        'user.nickname',
        'user.email',
        'user.role',
      ])
      .andWhere('manager.id = :managerId', { managerId: userId })
      .andWhere('event.id = :eventId', { eventId });

    if (eventDateId) {
      queryBuilder.andWhere(
        '(eventDates.id = :eventDateId OR :eventDateId IS NULL)',
        { eventDateId },
      );
    }

    //console.log(queryBuilder.getQuery());
    const event = await queryBuilder.getOne();

    if (!event) {
      const error = ERROR_CODES.EVENT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    return new CommonResponse(event);
  }

  async findAll(userId: any): Promise<CommonResponse<Event[]>> {
    console.log(userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    if (user.role != 'manager') {
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
