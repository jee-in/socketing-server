import { Injectable } from '@nestjs/common';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { plainToInstance } from 'class-transformer';
import { Reservation } from './entities/reservation.entity';
import { Order } from './entities/order.entity';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { UserWithPoint } from 'src/users/dto/user-with-point.dto';
import { EventDto } from 'src/events/dto/base/event.dto';
import { BasicSeatWithAreaDto } from 'src/events/dto/basic-seat-with-area.dot';
import { FindAllOrderRequestDto } from './dto/find-all-order-request.dto';
import { FindAllOrderResponseDto } from './dto/find-all-order-response.dto';
import { FindOneOrderResponseDto } from './dto/find-one-order-response.dto';

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

  async createOrder(
    body: CreateOrderRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreateOrderResponseDto>> {
    console.log(body);
    const { eventId, eventDateId, seatIds } = body;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    /* error handilng code */
    // user validation
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    // eventDate validation
    const eventDate = await this.eventDateRepository.findOne({
      where: { id: eventDateId, event: { id: eventId } },
      relations: ['event'],
    });
    if (!eventDate) {
      const error = ERROR_CODES.EVENT_DATE_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    // seat validation
    const seats = await this.seatRepository.find({
      where: { id: In(seatIds) },
      relations: ['area'],
    });

    if (seats.length !== seatIds.length) {
      const missingSeatIds = seatIds.filter(
        (seatId) => !seats.find((seat) => seat.id === seatId),
      );
      console.log(`Seats not found for IDs: ${missingSeatIds.join(', ')}`);
      const error = ERROR_CODES.SEAT_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    // reservation validation
    const reservedSeats = await Promise.all(
      seatIds.map(async (seatId) => {
        const isReserved = await this.isSeatReserved(seatId, eventDateId);
        return isReserved ? seatId : null;
      }),
    );

    const reservedSeatIds = reservedSeats.filter((seatId) => seatId !== null);

    if (reservedSeatIds.length > 0) {
      console.log(`Seats already reserved: ${reservedSeatIds.join(', ')}`);
      const error = ERROR_CODES.EXISTING_ORDER;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    try {
      // execute SQL query
      const newReservations = seats.map((seat) => {
        const reservation = this.reservationRepository.create({
          eventDate,
          seat,
        });
        return reservation;
      });

      const newOrder = this.orderRepository.create({
        user,
        reservations: newReservations, // order-reservation insertion mapping
      });

      const savedOrder = await this.orderRepository.save(newOrder);

      // configure response
      const userInstance = plainToInstance(UserWithPoint, user, {
        excludeExtraneousValues: true,
      });

      const eventIstance = plainToInstance(EventDto, eventDate.event, {
        excludeExtraneousValues: true,
      });

      const seatInstances = plainToInstance(BasicSeatWithAreaDto, seats, {
        excludeExtraneousValues: true,
      });
      console.log(seatInstances);

      const orderResponse = plainToInstance(
        CreateOrderResponseDto,
        {
          ...savedOrder,
          totalAmount: seats.reduce((sum, seat) => sum + seat.area.price, 0),
          user: userInstance,
          event: eventIstance,
          seats: seatInstances,
        },
        {
          excludeExtraneousValues: true,
        },
      );

      await queryRunner.commitTransaction();
      return new CommonResponse(orderResponse);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      if (e instanceof QueryFailedError && e.driverError.code === '23505') {
        const uniqueError = ERROR_CODES.EXISTING_RESERVATION;
        throw new CustomException(
          uniqueError.code,
          uniqueError.message,
          uniqueError.httpStatus,
        );
      }
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllOrders(
    findAllOrderRequestDto: FindAllOrderRequestDto,
    userId: string,
  ): Promise<CommonResponse<FindAllOrderResponseDto[]>> {
    const { eventId } = findAllOrderRequestDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .innerJoinAndSelect('order.reservations', 'reservation')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.area', 'area')
      .innerJoinAndSelect('order.payments', 'payment')
      .andWhere('order.deletedAt IS NULL')
      .andWhere("payment.paymentStatus = 'completed'");
    if (eventId) {
      queryBuilder.andWhere('event.id = :eventId', { eventId });
    }

    if (user.role == 'user') {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    console.log(queryBuilder.getQuery());

    const selectedOrders = await queryBuilder
      .select([
        'order.id AS orderId',
        'order.createdAt AS orderCreatedAt',
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

  async findOneOrder(
    orderId: string,
    userId: string,
  ): Promise<CommonResponse<FindOneOrderResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.user', 'user')
      .innerJoinAndSelect('order.reservations', 'reservation')
      .innerJoinAndSelect('reservation.eventDate', 'eventDate')
      .innerJoinAndSelect('eventDate.event', 'event')
      .innerJoinAndSelect('reservation.seat', 'seat')
      .innerJoinAndSelect('seat.area', 'area')
      .innerJoinAndSelect('order.payments', 'payment')
      .andWhere('order.deletedAt IS NULL')
      .andWhere("payment.paymentStatus = 'completed'")
      .andWhere('order.id = :orderId', { orderId });

    if (user.role == 'user') {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    console.log(queryBuilder.getQuery());

    const selectedOrder = await queryBuilder
      .select([
        'order.id AS orderId',
        'order.createdAt AS orderCreatedAt',
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
}
