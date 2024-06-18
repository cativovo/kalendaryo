import ky from "ky";
import { CalendarEvent } from "@/schema/event";

const api = ky.create({ prefixUrl: import.meta.env.VITE_BFF_URL });
enum ApiPath {
  CalendarEvents = "calendar-events",
}

export type CreateEventPayload = Omit<CalendarEvent, "id">;
export async function createEvent(
  payload: CreateEventPayload,
): Promise<CalendarEvent> {
  return await api.post(ApiPath.CalendarEvents, { json: payload }).json();
}

export async function findAllEvents(): Promise<CalendarEvent[]> {
  return await api.get(ApiPath.CalendarEvents).json();
}
