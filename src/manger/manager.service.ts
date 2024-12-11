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

  private mapRawToEntities(rawData: any[]): { event: any } {
    let event = null; // 단일 event 데이터를 저장
    const areaMap = new Map(); // area 데이터를 고유하게 저장
  
    rawData.forEach(row => {
      // Event 데이터는 한 번만 설정
      if (!event) {
        event = {
          id: row.event_id,
          title: row.event_title,
          thumbnail: row.event_thumbnail,
          place: row.event_place,
          cast: row.event_cast,
          ageLimit: row.event_agelimit,
          svg: row.event_svg,
          ticketingStartTime: row.event_ticketingstarttime,
          createdAt: row.event_createdat,
          updatedAt: row.event_updatedat,
          user: {
            id: row.manager_id,
            nickname: row.manager_nickname,
            email: row.manager_email,
            profileImage: row.manager_profileimage,
            role: row.manager_role,
          },
          areas: [],
        };
      }

      if (!areaMap.has(row.area_id)) {
        const area = {
          id: row.area_id,
          label: row.area_label,
          price: row.area_price,
          svg: row.area_svg,
          seats: [],
        };
        areaMap.set(row.area_id, area);
        event.areas.push(area);
      }
  
      if (row.seat_id) {
        const area = areaMap.get(row.area_id);
        const seat = {
          id: row.seat_id,
          cx: row.seat_cx,
          cy: row.seat_cy,
          row: row.seat_row,
          number: row.seat_number,
          label: row.area_label,
          price: row.area_price,
          reservations: [],
        };
  
        if (row.reservation_id) {
          seat.reservations.push({
            id: row.reservation_id,
            canceledAt: row.reservation_canceledat,
            order: {
              id: row.order_id,
              canceledAt: row.order_canceledat,
              createdAt: row.order_createdat,
              updatedAt: row.order_updatedat,
              deletedAt: row.order_deletedat,
              user: {
                id: row.user_id,
                nickname: row.user_nickname,
                email: row.user_email,
                role: row.user_role,
              },
            },
          });
        }
  
        area.seats.push(seat);
      }
    });
  
    return {
      event,
    };
  }


  async findOneEventWithSeatStatus(
    userId: any,
    eventId: string,
    eventDateId: string,
  ): Promise<CommonResponse<any>> {
    const queryBuilder = this.eventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.user', 'manager')
    .leftJoinAndSelect(
      'event.eventDates',
      'eventDates',
      'eventDates.deletedAt IS NULL',
    )
    .leftJoinAndSelect('event.areas', 'area')
    .leftJoinAndSelect('area.seats', 'seat')
    .leftJoinAndSelect('seat.reservations', 'reservation', 'reservation.canceledAt IS NULL')
    .leftJoinAndSelect('reservation.order', 'order', 'order.canceledAt IS NULL')
    .leftJoinAndSelect('order.user', 'user')
    .select([
      'event.id AS event_id',
      'event.title AS event_title',
      'event.thumbnail AS event_thumbnail',
      'event.place AS event_place',
      'event.cast AS event_cast',
      'event.ageLimit AS event_agelimit',
      'event.svg AS event_svg',
      'event.ticketingStartTime AS event_ticketingstarttime',
      'event.createdAt AS event_createdat',
      'event.updatedAt AS event_updatedat',
      'manager.id AS manager_id',
      'manager.nickname AS manager_nickname',
      'manager.email AS manager_email',
      'manager.profileImage AS manager_profileimage',
      'manager.role AS manager_role',
      'area.id AS area_id',
      'area.label AS area_label',
      'area.price AS area_price',
      'area.svg AS area_svg',
      'seat.id AS seat_id',
      'seat.cx AS seat_cx',
      'seat.cy AS seat_cy',
      'seat.row AS seat_row',
      'seat.number AS seat_number',
      'reservation.id AS reservation_id',
      'reservation.canceledAt AS reservation_canceledat',
      'order.id AS order_id',
      'order.canceledAt AS order_canceledat',
      'order.createdAt AS order_createdat',
      'order.updatedAt AS order_updatedat',
      'order.deletedAt AS order_deletedat',
      'user.id AS user_id',
      'user.nickname AS user_nickname',
      'user.email AS user_email',
      'user.role AS user_role',
    ])
    .andWhere('manager.id = :managerId', { managerId: userId })
    .andWhere('event.id = :eventId', { eventId })

  if (eventDateId) {
    queryBuilder.andWhere(
      '(eventDates.id = :eventDateId OR :eventDateId IS NULL)',
      { eventDateId },
    );
  }

  const rawResults = await queryBuilder.getRawMany();
  const { event } = this.mapRawToEntities(rawResults);

  if (!event) {
    const error = ERROR_CODES.EVENT_NOT_FOUND;
    throw new CustomException(error.code, error.message, error.httpStatus);
  }

  const totalSalesQueryBuilder = this.eventRepository
    .createQueryBuilder('event')
    .leftJoin('event.areas', 'area')
    .leftJoin('area.seats', 'seat')
    .leftJoin('seat.reservations', 'reservation', 'reservation.canceledAt IS NULL')
    .select('SUM(area.price)', 'total_sales')
    .andWhere('event.id = :eventId', { eventId })
    .andWhere('reservation.id IS NOT NULL');

  const totalSalesResult = await totalSalesQueryBuilder.getRawOne();
  const totalSales = parseFloat(totalSalesResult?.total_sales || '0');
    
    return new CommonResponse({
      ...event,
      totalSales
    });
  }

  async findAll(userId: any): Promise<CommonResponse<Event[]>> {
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
      .andWhere('user.id = :userId', { userId })
      .orderBy('event.createdAt', 'DESC')
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
}
