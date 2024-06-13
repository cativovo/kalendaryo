import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import store from 'src/store';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarEventsService {
  async create(createCalendarEventDto: CreateCalendarEventDto) {
    const event = {
      ...createCalendarEventDto,
      id: nanoid(),
    };

    return await store.addCalendarEvent(event);
  }

  async findAll() {
    return await store.findCalendarEvents();
  }

  async findByID(id: string) {
    return await store.findCalendarEventById(id);
  }

  async update(id: string, updateCalendarEventDto: UpdateCalendarEventDto) {
    return await store.updateCalendarEvent(id, updateCalendarEventDto);
  }

  async remove(id: string) {
    await store.removeEvent(id);
  }
}
