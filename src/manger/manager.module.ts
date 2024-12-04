import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Seat } from 'src/events/entities/seat.entity';
import { EventDate } from 'src/events/entities/event-date.entity';
import { Area } from 'src/events/entities/area.entity';
import { Payment } from 'src/reservations/entities/payment.entity';
import { Order } from 'src/reservations/entities/order.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { ManagersController } from './manager.controller';
import { ManagersService } from './manager.service';
import { Event } from 'src/events/entities/event.entity';

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
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService, TypeOrmModule],
})
export class ManagersModule {}
