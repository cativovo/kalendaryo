import { z } from "zod";

export const eventTypes = ["shift", "availability"] as const;

export const Event = z.object({
  type: z.enum(eventTypes),
  from: z.number(),
  to: z.number(),
});

export type Event = z.infer<typeof Event>;
