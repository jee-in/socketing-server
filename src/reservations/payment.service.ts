import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { CommonResponse } from 'src/common/dto/common-response.dto';
import { User } from 'src/users/entities/user.entity';
import { CustomException } from 'src/exceptions/custom-exception';
import { ERROR_CODES } from 'src/contants/error-codes';
import { PaymentStatus } from 'src/common/enum/payment-status';
import { plainToInstance } from 'class-transformer';
import { Payment } from './entities/payment.entity';
import { Order } from './entities/order.entity';
import { Reservation } from './entities/reservation.entity';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentDto } from './dto/base/payment.dto';
import { OrderDto } from './dto/base/order.dto';
import { UpdatePaymentRequestDto } from './dto/update-payment-request.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async createPayment(
    createPaymentRequestDto: CreatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<CreatePaymentResponseDto>> {
    const { orderId, paymentMethod, totalAmount } = createPaymentRequestDto;
    //console.log(orderId, paymentMethod, totalAmount);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['reservations'],
    });
    console.log(order);
    if (!order) {
      const error = ERROR_CODES.ORDER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }
    /* 주문자가 로그인한 사람과 같은지 검사하는 코드 */
    // if (order.user.id != user.id) {
    //   const error = ERROR_CODES.ORDER_USER_MISMATCH;
    //   throw new CustomException(error.code, error.message, error.httpStatus);
    // }

    const error = ERROR_CODES.RESERVATION_NOT_FOUND;
    if (!order.reservations) {
      throw new CustomException(error.code, error.message, error.httpStatus);
    } else {
      order.reservations.forEach((reservation) => {
        if (!reservation) {
          throw new CustomException(
            error.code,
            error.message,
            error.httpStatus,
          );
        }
      });
    }

    const payment = await this.paymentRepository.findOne({
      where: {
        order: { id: orderId },
        paymentStatus: Not(PaymentStatus.CANCELED),
      },
      relations: ['order'],
    });
    if (payment) {
      const error = ERROR_CODES.EXISTING_PAYMENT;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    try {
      const newPayment = this.paymentRepository.create({
        order,
        paymentMethod,
        paymentAmount: totalAmount,
        paymentStatus: PaymentStatus.PENDING,
      });

      const savedPayment = await this.paymentRepository.save(newPayment);

      const paymentInstance = plainToInstance(PaymentDto, savedPayment, {
        excludeExtraneousValues: true,
      });
      console.log(paymentInstance);

      const orderInstance = plainToInstance(OrderDto, order, {
        excludeExtraneousValues: true,
      });

      const paymentResponse = plainToInstance(
        CreatePaymentResponseDto,
        {
          user: user,
          order: orderInstance,
          payment: paymentInstance,
        },
        { excludeExtraneousValues: true },
      );

      await queryRunner.commitTransaction();
      return new CommonResponse(paymentResponse);
    } catch (e) {
      console.log(e);
      // 예외 처리
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updatePayment(
    updatePaymentRequestDto: UpdatePaymentRequestDto,
    userId: string,
  ): Promise<CommonResponse<any>> {
    const { orderId, paymentId, newPaymentStatus } = updatePaymentRequestDto;

    /* Transaction */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    /* Error handling */
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new CustomException(error.code, error.message, error.httpStatus);
    }

    try {
      const existingPayment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });
      if (!existingPayment) {
        const error = ERROR_CODES.PAYMENT_NOT_FOUND;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // 연결된 reservation 없는지 확인하는 예외 처리도 추가하기

      const originalPaymentStatus = existingPayment.paymentStatus;
      if (
        originalPaymentStatus === PaymentStatus.COMPLETED &&
        newPaymentStatus === PaymentStatus.COMPLETED
      ) {
        const error = ERROR_CODES.INVALID_PAYMENT_REQUEST;
        throw new CustomException(error.code, error.message, error.httpStatus);
      }

      // Payment 업데이트
      existingPayment.paymentStatus = newPaymentStatus;
      existingPayment.paidAt = new Date();
      const updatedPayment = await this.paymentRepository.save(existingPayment);

      // PaymentStatus가 COMPLETED일 때 포인트 차감
      if (updatedPayment.paymentStatus === PaymentStatus.COMPLETED) {
        if (user.point >= updatedPayment.paymentAmount) {
          user.point -= updatedPayment.paymentAmount;
          await this.userRepository.save(user);
        } else {
          const error = ERROR_CODES.INSUFFICIENT_BALANCE;
          throw new CustomException(
            error.code,
            error.message,
            error.httpStatus,
          );
        }
      }

      const selectedPayment = await this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.order', 'order')
        .leftJoinAndSelect('order.user', 'user')
        .leftJoinAndSelect('order.reservations', 'reservation')
        .leftJoinAndSelect('reservation.eventDate', 'eventDate')
        .leftJoinAndSelect('eventDate.event', 'event')
        .leftJoinAndSelect('reservation.seat', 'seat')
        .leftJoinAndSelect('seat.area', 'area')
        .select([
          'payment.id AS paymentId',
          'payment.paymentAmount AS paymentAmount',
          'payment.paymentMethod AS paymentMethod',
          'payment.paymentStatus AS paymentStatus',
          'payment.paidAt AS paymentPaidAt',
          'payment.createdAt AS paymentCreatedAt',
          'payment.updatedAt AS paymentUpdatedAt',
          'order.id AS orderId',
          'order.createdAt AS orderCreatedAt',
          'order.updatedAt AS orderUpdatedAt',
          'order.deletedAt AS orderDeletedAt',
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
        .andWhere('order.id = :orderId', { orderId })
        .andWhere('payment.id = :paymentId', { paymentId })
        .getRawMany();

      console.log(selectedPayment);

      // 응답 데이터 구성
      // 공통 데이터 추출 (첫 번째 레코드 기준)
      const firstPayment = selectedPayment[0];

      // Reservation 데이터 구성
      const reservations = selectedPayment.map((payment) => ({
        reservationId: payment.reservationid,
        seatId: payment.seatid,
        seatCx: payment.seatcx || null,
        seatCy: payment.seatcy || null,
        seatRow: payment.seatrow,
        seatNumber: payment.seatnumber,
        seatAreaId: payment.areaid,
        seatAeaLabel: payment.arealabel,
        seatAreaPrice: payment.areaprice,
      }));

      // UpdatePaymentResponseDto 데이터 구성
      const responseData = {
        orderId: firstPayment.orderid,
        orderCreatedAt: firstPayment.ordercreatedat || null,
        orderUpdatedAt: firstPayment.orderupdatedat || null,
        orderDeletedAt: firstPayment.orderdeletedat || null,
        paymentId: firstPayment.paymentid,
        paymentStatus: firstPayment.paymentstatus,
        paymentMethod: firstPayment.paymentmethod,
        paymentAmount: firstPayment.paymentamount,
        paymentPaidAt: firstPayment.paymentpaidat || null,
        paymentCreatedAt: firstPayment.paymentcreatedat || null,
        paymentUpdatedAt: firstPayment.paymentupdatedat || null,
        userId: firstPayment.userid || null,
        userNickname: firstPayment.usernickname || null,
        userEmail: firstPayment.useremail || null,
        userProfileImage: firstPayment.userprofileimage || null,
        userRole: firstPayment.userrole || null,
        eventTitle: firstPayment.eventtitle,
        eventDate: firstPayment.eventdate || null,
        eventThumbnail: firstPayment.eventthumbnail || null,
        eventPlace: firstPayment.eventplace || null,
        eventCast: firstPayment.eventcast || null,
        eventAgeLimit: firstPayment.eventagelimit || null,
        reservations: reservations,
      };
      // console.log(responseData);

      await queryRunner.commitTransaction();
      return new CommonResponse(responseData);
    } catch (e) {
      console.error(e);
      // 에러 처리
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
