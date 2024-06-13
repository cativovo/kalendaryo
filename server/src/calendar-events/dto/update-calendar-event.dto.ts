import { z } from 'zod';
import { CreateCalendarEventDto } from './create-calendar-event.dto';

export const UpdateCalendarEventDto = CreateCalendarEventDto.partial();

export type UpdateCalendarEventDto = z.infer<typeof UpdateCalendarEventDto>;
