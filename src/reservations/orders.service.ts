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
    const orderInstances = plainToInstance(
      FindAllOrderResponseDto,
      groupedOrdersArray,
      { excludeExtraneousValues: true },
    );

    return new CommonResponse(orderInstances);
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
        'event.svg AS eventSvg',
        'reservation.id AS reservationId',
        'seat.id AS seatId',
        'seat.cx AS seatCx',
        'seat.cy AS seatCy',
        'seat.row AS seatRow',
        'seat.number AS seatNumber',
        'area.id AS areaId',
        // 'area.svg AS areaSvg',
        'area.label AS areaLabel',
        'area.price AS areaPrice',
      ])
      .getRawMany();

    if (!selectedOrder) {
      return new CommonResponse(null);
    }

    const commonOrder = selectedOrder[0];
    const commonOrderData = {
      orderId: commonOrder.orderid,
      orderCreatedAt: commonOrder.ordercreatedat,
      orderCanceledAt: commonOrder.ordercanceledat,
      userId: commonOrder.userid,
      userNickname: commonOrder.usernickname,
      userEmail: commonOrder.useremail,
      userProfileImage: commonOrder.userprofileimage,
      userRole: commonOrder.userrole,
      eventDateId: commonOrder.eventdateid,
      eventDate: commonOrder.eventdatedate,
      eventId: commonOrder.eventid,
      eventTitle: commonOrder.eventtitle,
      eventThumbnail: commonOrder.eventthumbnail,
      eventPlace: commonOrder.eventplace,
      eventCast: commonOrder.eventcast,
      eventAgeLimit: commonOrder.eventagelimit,
      eventSvg: commonOrder.eventsvg,
    };

    const orderResponse = {
      ...commonOrderData,
      reservations: [],
    };

    selectedOrder.forEach((order) => {
      orderResponse.reservations.push({
        reservationId: order.reservationid,
        seatId: order.seatid,
        seatCx: order.seatcx,
        seatCy: order.seatcy,
        seatRow: order.seatrow,
        seatNumber: order.seatnumber,
        seatAreaId: order.areaid,
        seatAreaLabel: order.arealabel,
        seatAreaPrice: order.areaprice,
        // seatAreaSvg: order.areasvg,
      });
    });

    const orderInstance = plainToInstance(
      FindOneOrderResponseDto,
      orderResponse,
      {
        excludeExtraneousValues: true,
      },
    );

    return new CommonResponse(orderInstance);
  }

  async cancelOne(
    orderId: string,
    userId: string,
  ): Promise<CommonResponse<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const order = await queryRunner.manager
        .createQueryBuilder(Order, 'o')
        .leftJoinAndSelect('o.reservations', 'reservation')
        .leftJoinAndSelect('reservation.seat', 'seat')
        .leftJoinAndSelect('seat.area', 'area')
        .andWhere('o.id = :orderId', { orderId })
        .andWhere('o.userId = :userId', { userId })
        .getOne();

      if (!order) {
        const error = ERROR_CODES.ORDER_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      if (order.canceledAt != null) {
        const error = ERROR_CODES.ALREADY_CANCELED_ORDER;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // 유저 포인트 반환을 위해 주문 금액 계산
      const refundingAmount = order.reservations.reduce((sum, reservation) => {
        return sum + reservation.seat.area.price;
      }, 0);

      await queryRunner.manager
        .createQueryBuilder()
        .update(Order)
        .set({ canceledAt: new Date() })
        .where('id = :orderId', { orderId })
        .execute();

      const reservations = order.reservations;

      for (const r of reservations) {
        const reservationId = r.id;

        await queryRunner.manager
          .createQueryBuilder()
          .update(Reservation)
          .set({ canceledAt: new Date() })
          .where('id = :reservationId', { reservationId })
          .execute();
      }

      // 유저 포인트 반환
      await queryRunner.manager
        .createQueryBuilder()
        .update('user')
        .set({
          point: () => 'point + :refundingAmount',
        })
        .where('id = :userId', { userId })
        .setParameter('refundingAmount', refundingAmount)
        .execute();

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
