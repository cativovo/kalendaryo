import { mount } from "@vue/test-utils";
import Calendar from "./Calendar.vue";

beforeEach(() => {
  // tell vitest we use mocked time
  vi.useFakeTimers();
});

afterEach(() => {
  // restoring date after each test run
  vi.useRealTimers();
});

test("Calendar is rendering properly", () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("July");
  expect(wrapper.get('[data-testid="year-select"]').text()).toBe("2024");

  const table = wrapper.get("table");

  const thead = table.get("thead");
  const ths = thead.findAll("th");
  expect(ths).toHaveLength(days.length);
  for (const i in ths) {
    expect(ths[i].text()).toBe(days[i]);
  }

  const tbody = table.get("tbody");
  const trs = tbody.findAll("tr");
  const tds = tbody.findAll("td");

  expect(trs).toHaveLength(5);
  expect(tds).toHaveLength(35);

  const daysInCalendar: string[] = [
    "30",
    ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // 1-31
    "1",
    "2",
    "3",
  ];

  for (const i in daysInCalendar) {
    expect(tds[i].text()).toBe(daysInCalendar[i]);
  }
});

test("Calendar is rendering previous month properly", async () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);

  await wrapper.get('[data-testid="prev-month-btn"]').trigger("click");

  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("June");

  const table = wrapper.get("table");
  const tbody = table.get("tbody");
  const tds = tbody.findAll("td");

  expect(tds).toHaveLength(42);

  const daysInCalendar: string[] = [
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    ...Array.from({ length: 30 }, (_, i) => (i + 1).toString()), // 1-30
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ];

  for (const i in daysInCalendar) {
    expect(tds[i].text()).toBe(daysInCalendar[i]);
  }
});

test("Calendar is rendering next month properly", async () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);

  await wrapper.get('[data-testid="next-month-btn"]').trigger("click");

  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("August");

  const table = wrapper.get("table");
  const tbody = table.get("tbody");
  const tds = tbody.findAll("td");

  expect(tds).toHaveLength(35);

  const daysInCalendar: string[] = [
    "28",
    "29",
    "30",
    "31",
    ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // 1-31
  ];

  for (const i in daysInCalendar) {
    expect(tds[i].text()).toBe(daysInCalendar[i]);
  }
});

test("Month popover is rendering properly", async () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  const buttons = wrapper.findAll('[data-testid="popover"] > button');
  expect(buttons).toHaveLength(12);
  expect(buttons.map((button) => button.text())).toEqual(months);
});

test("Select month", async () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);

  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("July");

  // Select January
  await wrapper
    .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
    .trigger("click");
  await wrapper
    .get('[data-testid="popover"] > button:nth-child(1)')
    .trigger("click");
  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("January");

  let tds = wrapper.findAll("table > tbody td");

  expect(tds).toHaveLength(35);

  const daysInJanuary2024: string[] = [
    "31",
    ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // 1-31
    "1",
    "2",
    "3",
  ];

  for (const i in daysInJanuary2024) {
    expect(tds[i].text()).toBe(daysInJanuary2024[i]);
  }

  // Select December
  await wrapper
    .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
    .trigger("click");
  await wrapper
    .get('[data-testid="popover"] > button:nth-child(12)')
    .trigger("click");

  expect(
    wrapper
      .get('[data-testid="month-popover"] [data-testid="popover-btn"]')
      .text(),
  ).toBe("December");

  tds = wrapper.findAll("table > tbody td");

  expect(tds).toHaveLength(35);

  const daysInDecember2024: string[] = [
    ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()), // 1-31
    "1",
    "2",
    "3",
    "4",
  ];

  for (const i in daysInDecember2024) {
    expect(tds[i].text()).toBe(daysInDecember2024[i]);
  }
});
