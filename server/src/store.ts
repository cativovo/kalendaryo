// TODO: use db
type CalendarEvent = {
  id: string;
  type: string;
  from: number;
  to: number;
};

function delay(ms = 500): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

class Store {
  private events: CalendarEvent[] = [];

  async addCalendarEvent(calendarEvent: CalendarEvent): Promise<CalendarEvent> {
    await delay();
    this.events.push(calendarEvent);
    return calendarEvent;
  }

  async updateCalendarEvent(
    id: string,
    calendarEvent: Partial<Omit<CalendarEvent, 'id'>>,
  ): Promise<CalendarEvent | undefined> {
    await delay();
    const i = this.events.findIndex((v) => v.id === id);

    if (i < 0) {
      return undefined;
    }

    const event = {
      ...this.events[i],
      ...calendarEvent,
    };

    this.events[i] = event;

    return event;
  }

  async findCalendarEvents(): Promise<CalendarEvent[]> {
    await delay();
    return this.events;
  }

  async findCalendarEventById(id: string): Promise<CalendarEvent | undefined> {
    await delay();
    return this.events.find((v) => v.id === id);
  }

  async removeEvent(id: string): Promise<void> {
    await delay();
    this.events = this.events.filter((v) => v.id !== id);
  }
}

const store = new Store();

export default store;
