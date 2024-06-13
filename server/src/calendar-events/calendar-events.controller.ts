import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ZodValidationPipe } from 'src/pipes/zod';

@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateCalendarEventDto))
    createCalendarEventDto: CreateCalendarEventDto,
  ) {
    return this.calendarEventsService.create(createCalendarEventDto);
  }

  @Get()
  findAll() {
    return this.calendarEventsService.findAll();
  }

  @Get(':id')
  findByID(@Param('id') id: string) {
    return this.calendarEventsService.findByID(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCalendarEventDto))
    updateCalendarEventDto: UpdateCalendarEventDto,
  ) {
    return this.calendarEventsService.update(id, updateCalendarEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventsService.remove(id);
  }
}
