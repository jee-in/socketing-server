import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  QueryFailedError,
  QueryRunner,
  Repository,
} from 'typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { Order } from './entities/order.entity';
import { Reservation } from './entities/reservation.entity';
import { Payment } from './entities/payment.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventDate)
    private readonly eventDateRepository: Repository<EventDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async isSeatReserved(
    seatId: string,
    eventDateId: string,
    queryRunner: QueryRunner,
  ): Promise<boolean> {
    const reservedReservation = await queryRunner.manager
      .createQueryBuilder('reservation', 'reservation')
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

  async createPaymentforMigration(
    createPaymentRequestDto: CreatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<any>> {
    const { paymentMethod, eventDateId, seatIds } = createPaymentRequestDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // 사용자 조회
      const user = await queryRunner.manager
        .createQueryBuilder('user', 'user')
        .where('user.id = :userId', { userId })
        .getOne();

      // EventDate 검증
      const eventDate = await queryRunner.manager.findOne(EventDate, {
        where: { id: eventDateId },
        relations: ['event'],
      });
      if (!eventDate) {
        const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // 좌석 검증
      const seats = await queryRunner.manager.find(Seat, {
        where: { id: In(seatIds) },
        relations: ['area'],
      });
      if (seats.length !== seatIds.length) {
        const missingSeatIds = seatIds.filter(
          (seatId) => !seats.some((seat) => seat.id === seatId),
        );

        console.log(`Missing seat IDs: ${missingSeatIds.join(', ')}`);
        const error = ERROR_CODES.SEAT_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // 예약 여부 검증
      const reservedSeats = await Promise.all(
        seatIds.map(async (seatId) => {
          const isReserved = await this.isSeatReserved(
            seatId,
            eventDateId,
            queryRunner,
          );
          return isReserved ? seatId : null;
        }),
      );

      const reservedSeatIds = reservedSeats.filter((seatId) => seatId !== null);
      if (reservedSeatIds.length > 0) {
        const error = ERROR_CODES.EXISTING_ORDER;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // 예약 생성
      const newReservations = seats.map((seat) =>
        queryRunner.manager.create(Reservation, { eventDate, seat }),
      );
      await queryRunner.manager.save(newReservations);

      // 주문 생성
      const newOrder = queryRunner.manager.create(Order, {
        user,
        paymentMethod,
        reservations: newReservations,
      });
      const savedOrder = await queryRunner.manager.save(newOrder);

      // 총 금액 계산
      const objTotalAmount = await queryRunner.manager
        .createQueryBuilder()
        .select('SUM(area.price)', 'totalAmount')
        .from(Reservation, 'reservation')
        .leftJoin('reservation.seat', 'seat')
        .leftJoin('seat.area', 'area')
        .where('reservation.eventDateId = :eventDateId', { eventDateId })
        .andWhere('reservation.seatId IN (:...seatIds)', { seatIds })
        .getRawOne();

      const totalAmount = Number(objTotalAmount?.totalAmount || 0);

      // totalAmount 예외 처리 넣기

      // 포인트 차감
      if (user.point < totalAmount) {
        const error = ERROR_CODES.INSUFFICIENT_BALANCE;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }
      user.point -= totalAmount;
      await queryRunner.manager.save(user);

      // 주문 데이터 조회 및 응답 데이터 구성
      const qb = await queryRunner.manager
        .createQueryBuilder('order', 'o')
        .leftJoinAndSelect('o.user', 'user')
        .leftJoinAndSelect('o.reservations', 'reservation')
        .leftJoinAndSelect('reservation.eventDate', 'eventDate')
        .leftJoinAndSelect('eventDate.event', 'event')
        .leftJoinAndSelect('reservation.seat', 'seat')
        .leftJoinAndSelect('seat.area', 'area')
        .select([
          'o.id AS orderId',
          'o.paymentMethod AS paymentMethod',
          'o.createdAt AS orderCreatedAt',
          'o.updatedAt AS orderUpdatedAt',
          'o.deletedAt AS orderDeletedAt',
          'user.id AS userId',
          'user.nickname AS userNickname',
          'user.profileImage AS userProfileImage',
          'user.role AS userRole',
          'user.email AS userEmail',
          'eventDate.date AS eventDate',
          'reservation.id AS reservationId',
          'eventDate.id AS eventDateId',
          'event.id AS eventId',
          'event.title AS eventTitle',
          'event.thumbnail AS eventThumbnail',
          'event.place AS eventPlace',
          'event.cast AS eventCast',
          'event.ageLimit AS ageLimit',
          'seat.id AS seatId',
          'seat.row AS seatRow',
          'seat.cx AS seatCx',
          'seat.cy AS seatCy',
          'seat.number AS seatNumber',
          'area.id AS areaId',
          'area.label AS areaLabel',
          'area.price AS areaPrice',
        ])
        .where('o.id = :orderId', { orderId: savedOrder.id })

      // 생성된 쿼리와 파라미터를 출력
      const [query, parameters] = qb.getQueryAndParameters();
      console.log('Generated Query:', query);
      console.log('Query Parameters:', parameters);

      const selectedOrder = await qb.getRawOne();


      const reservations = [
        {
          reservationId: selectedOrder.reservationid,
          seatId: selectedOrder.seatid,
          seatCx: selectedOrder.seatcx || null,
          seatCy: selectedOrder.seatcy || null,
          seatRow: selectedOrder.seatrow,
          seatNumber: selectedOrder.seatnumber,
          seatAreaId: selectedOrder.areaid,
          seatAreaLabel: selectedOrder.arealabel,
          seatAreaPrice: selectedOrder.areaprice,
        },
      ];

      const responseData = {
        orderId: selectedOrder.orderid,
        orderCreatedAt: selectedOrder.ordercreatedat || null,
        orderUpdatedAt: selectedOrder.orderupdatedat || null,
        orderDeletedAt: selectedOrder.orderdeletedat || null,
        paymentMethod: selectedOrder.paymentmethod || null,
        paymentAmount: selectedOrder.paymentamount || totalAmount || null,
        userId: selectedOrder.userid || null,
        userNickname: selectedOrder.usernickname || null,
        userEmail: selectedOrder.useremail || null,
        userProfileImage: selectedOrder.userprofileimage || null,
        userRole: selectedOrder.userrole || null,
        eventTitle: selectedOrder.eventtitle,
        eventDate: selectedOrder.eventdate || null,
        eventThumbnail: selectedOrder.eventthumbnail || null,
        eventPlace: selectedOrder.eventplace || null,
        eventCast: selectedOrder.eventcast || null,
        eventAgeLimit: selectedOrder.eventagelimit || null,
        reservations: reservations,
      };

      await queryRunner.commitTransaction();
      return new CommonResponse(responseData);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const error = ERROR_CODES.EXISTING_RESERVATION;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePayment(body: any, userId: string): Promise<CommonResponse<any>> {
    /* deprecated method. no logic */
    console.log('empty service invoked');
    if (body) {
    }
    if (userId) {
    }
    return;
  }
}
