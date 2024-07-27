import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CalendarEventsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
