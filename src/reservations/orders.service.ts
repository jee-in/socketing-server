import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { User } from 'src/users/entities/user.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { plainToInstance } from 'class-transformer';
import { Reservation } from './entities/reservation.entity';
import { Order } from './entities/order.entity';
import { FindAllOrderRequestDto } from './dto/find-all-order-request.dto';
import { FindAllOrderResponseDto } from './dto/find-all-order-response.dto';
import { FindOneOrderResponseDto } from './dto/find-one-order-response.dto';
import { ERROR_CODES } from 'src/contants/error-codes';
import { CustomException } from 'src/exceptions/custom-exception';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async isSeatReserved(seatId: string, eventDateId: string): Promise<boolean> {
    const reservedReservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .innerJoin('reservation.eventDate', 'eventDate')
      .leftJoin('reservation.seat', 'seat')
      .innerJoin('seat.area', 'area')
      .leftJoin('reservation.order', 'order')
      .where('eventDate.id = :eventDateId', { eventDateId })
      .andWhere('seat.id = :seatId', { seatId })
      .andWhere('order.deletedAt IS NULL')
      .getOne();

    return !!reservedReservation;
  }

  // async createOrder(
  //   body: CreateOrderRequestDto,
  //   userId: string,
  // ): Promise<CommonResponse<any>> {
  //   console.log('empty service invoked');
  //   if (body) {
  //   }
  //   if (userId) {
  //   }
  //   return;
  // }

  async findAll(
    findAllOrderRequestDto: FindAllOrderRequestDto,
    userId: string,
  ): Promise<CommonResponse<FindAllOrderResponseDto[]>> {
    const { eventId } = findAllOrderRequestDto;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect('o.user', 'user')
      .innerJoinAndSelect('o.reservations', 'reservation')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.area', 'area')
      .andWhere('o.deletedAt IS NULL')
      .andWhere('user.id = :userId', { userId });
    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }
    queryBuilder.orderBy('o.createdAt', 'DESC');

    console.log(queryBuilder.getQuery());

    const selectedOrders = await queryBuilder
      .select([
        'o.id AS orderId',
        'o.createdAt AS orderCreatedAt',
        'o.canceledAt AS orderCanceledAt',
        'user.id AS userId',
        'user.nickname AS userNickname',
        'user.email AS userEmail',
        'user.profileImage AS userProfileImage',
        'user.role AS userRole',
        'eventDate.id AS eventDateId',
        'eventDate.date AS eventDateDate',
        'event.id AS eventId',
        'event.title AS eventTitle',
        'event.thumbnail AS eventThumbnail',
        'event.place AS eventPlace',
        'event.cast AS eventCast',
        'event.ageLimit AS eventAgeLimit',
        'seat.id AS seatId',
        'seat.cx AS seatCx',
        'seat.cy AS seatCy',
        'seat.row AS seatRow',
        'seat.number AS seatNumber',
        'area.id AS areaId',
        'area.label AS areaLabel',
        'area.price AS areaPrice',
      ])
      .getRawMany();
    console.log(selectedOrders);

    const groupedOrders = selectedOrders.reduce((acc, order) => {
      const orderId = order.orderid;

      // 현재 orderId로 그룹화된 데이터가 없으면 초기화
      if (!acc[orderId]) {
        acc[orderId] = {
          orderId,
          orderCreatedAt: order.ordercreatedat,
          orderCanceledAt: order.ordercanceledat,
          userId: order.userid,
          userNickname: order.usernickname,
          userEmail: order.useremail,
          userProfileImage: order.userprofileimage,
          userRole: order.userrole,
          eventDateId: order.eventdateid,
          eventDate: order.eventdatedate,
          eventId: order.eventid,
          eventTitle: order.eventtitle,
          eventThumbnail: order.eventthumbnail,
          eventPlace: order.eventplace,
          eventCast: order.eventcast,
          eventAgeLimit: order.eventagelimit,
          reservations: [],
        };
      }

      // 현재 orderId에 reservation 추가
      acc[orderId].reservations.push({
        reservationId: order.reservationid,
        seatId: order.seatid,
        seatCx: order.seatcx,
        seatCy: order.seatcy,
        seatRow: order.seatrow,
        seatNumber: order.seatnumber,
        seatAreaId: order.areaid,
        seatAreaLabel: order.arealabel,
        seatAreaPrice: order.areaprice,
      });

      return acc;
    }, {});

    // Object.values를 사용해 배열로 변환
    const groupedOrdersArray = Object.values(groupedOrders);
    const onrderInstances = plainToInstance(
      FindAllOrderResponseDto,
      groupedOrdersArray,
      { excludeExtraneousValues: true },
    );

    return new CommonResponse(onrderInstances);
  }

  async findOne(
    orderId: string,
    userId: string,
  ): Promise<CommonResponse<FindOneOrderResponseDto>> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect('o.user', 'user')
      .innerJoinAndSelect('o.reservations', 'reservation')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.area', 'area')
      .andWhere('user.id = :userId', { userId })
      .andWhere('o.deletedAt IS NULL')
      .andWhere('o.id = :orderId', { orderId });

    console.log(queryBuilder.getQuery());

    const selectedOrder = await queryBuilder
      .select([
        'o.id AS orderId',
        'o.createdAt AS orderCreatedAt',
        'o.canceledAt AS orderCanceledAt',
        'user.id AS userId',
        'user.nickname AS userNickname',
        'user.email AS userEmail',
        'user.profileImage AS userProfileImage',
        'user.role AS userRole',
        'eventDate.id AS eventDateId',
        'eventDate.date AS eventDateDate',
        'event.id AS eventId',
        'event.title AS eventTitle',
        'event.thumbnail AS eventThumbnail',
        'event.place AS eventPlace',
        'event.cast AS eventCast',
        'event.ageLimit AS eventAgeLimit',
        'seat.id AS seatId',
        'seat.cx AS seatCx',
        'seat.cy AS seatCy',
        'seat.row AS seatRow',
        'seat.number AS seatNumber',
        'area.id AS areaId',
        'area.label AS areaLabel',
        'area.price AS areaPrice',
      ])
      .getRawOne();

    console.log(selectedOrder);
    if (!selectedOrder) {
      return new CommonResponse(null);
    }

    // ...selectedOrder
    const orderData = {
      orderId,
      orderCreatedAt: selectedOrder.ordercreatedat,
      orderCanceledAt: selectedOrder.ordercanceledat,
      userId: selectedOrder.userid,
      userNickname: selectedOrder.usernickname,
      userEmail: selectedOrder.useremail,
      userProfileImage: selectedOrder.userprofileimage,
      userRole: selectedOrder.userrole,
      eventDateId: selectedOrder.eventdateid,
      eventDate: selectedOrder.eventdatedate,
      eventId: selectedOrder.eventid,
      eventTitle: selectedOrder.eventtitle,
      eventThumbnail: selectedOrder.eventthumbnail,
      eventPlace: selectedOrder.eventplace,
      eventCast: selectedOrder.eventcast,
      eventAgeLimit: selectedOrder.eventagelimit,
      reservations: [
        {
          reservationId: selectedOrder.reservationid,
          seatId: selectedOrder.seatid,
          seatCx: selectedOrder.seatcx,
          seatCy: selectedOrder.seatcy,
          seatRow: selectedOrder.seatrow,
          seatNumber: selectedOrder.seatnumber,
          seatAreaId: selectedOrder.areaid,
          seatAreaLabel: selectedOrder.arealabel,
          seatAreaPrice: selectedOrder.areaprice,
        },
      ],
    };

    const orderInstance = plainToInstance(FindOneOrderResponseDto, orderData, {
      excludeExtraneousValues: true,
    });

    return new CommonResponse(orderInstance);
  }

  async cancelOne(
    orderId: string,
    userId: string,
  ): Promise<CommonResponse<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    // 쿼리 실행

    // 응답 데이터 생성

    try {
      const order = await queryRunner.manager
        .createQueryBuilder('order', 'o')
        .select()
        .andWhere('o.userId = :userId', { userId })
        .getOne();

      if (!order) {
        const error = ERROR_CODES.ORDER_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      if (order.canceledAt) {
        const error = ERROR_CODES.ALREADY_CANCELED_ORDER;
        console.log(`This order is canceled at ${order.canceledAt}`);
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      const result = await queryRunner.manager
        .createQueryBuilder()
        .update('order')
        .set({ canceledAt: new Date() })
        .where('id = :orderId', { orderId: order.id })
        .execute();

      if (result.affected && result.affected > 0) {
        console.log('Update successful!');
      } else {
        console.log('No rows were updated.');
      }

      await queryRunner.commitTransaction();
      return new CommonResponse({});
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
