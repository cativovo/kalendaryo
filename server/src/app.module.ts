import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CalendarEventsModule,
  ],
})
export class AppModule {}
