import ky from "ky";

export const api = ky.create({ prefixUrl: import.meta.env.VITE_BFF_URL });
export enum ApiPath {
  CalendarEvents = "calendar-events",
  Auth = "auth",
}
