import { Module } from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';
import { CalendarEventsController } from './calendar-events.controller';

@Module({
  controllers: [CalendarEventsController],
  providers: [CalendarEventsService],
})
export class CalendarEventsModule {}
