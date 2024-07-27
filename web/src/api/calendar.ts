import { CalendarEvent } from "@/schema/event";
import { ApiPath, api } from "./client";

export type CreateEventPayload = Omit<CalendarEvent, "id">;
export async function createEvent(
  payload: CreateEventPayload,
): Promise<CalendarEvent> {
  return await api.post(ApiPath.CalendarEvents, { json: payload }).json();
}

export async function findAllEvents(): Promise<CalendarEvent[]> {
  return await api.get(ApiPath.CalendarEvents).json();
}
