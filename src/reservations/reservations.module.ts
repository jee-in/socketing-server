import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Area } from 'src/events/entities/area.entity';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      User,
      Seat,
      Area,
      Order,
      Event,
      EventDate,
      Payment,
    ]),
  ],
  controllers: [PaymentsController, OrdersController],
  providers: [PaymentsService, OrdersService],
  exports: [PaymentsService, OrdersService, TypeOrmModule],
})
export class ReservationsModule {}
