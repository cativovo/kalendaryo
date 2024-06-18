import { z } from "zod";

export const eventTypes = ["shift", "availability"] as const;

export const CalendarEvent = z.object({
  id: z.string(),
  type: z.enum(eventTypes),
  from: z.number(),
  to: z.number(),
});

export type CalendarEvent = z.infer<typeof CalendarEvent>;
