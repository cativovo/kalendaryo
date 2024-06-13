import { z } from 'zod';

const calendarEventTypes = ['availability', 'shift'] as const;

export const CreateCalendarEventDto = z.object({
  type: z.enum(calendarEventTypes),
  from: z.number(),
  to: z.number(),
});

export type CreateCalendarEventDto = z.infer<typeof CreateCalendarEventDto>;
