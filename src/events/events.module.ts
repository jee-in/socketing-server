import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controllers';
import { EventsService } from './events.service';
import { EventDate } from './entities/event-date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventDate])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, TypeOrmModule],
})
export class EventsModule {}
