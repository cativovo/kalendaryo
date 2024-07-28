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

  expect(wrapper.get('[data-testid="month-popover-btn"]').text()).toBe("July");
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

  expect(wrapper.get('[data-testid="month-popover-btn"]').text()).toBe("June");

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

  expect(wrapper.get('[data-testid="month-popover-btn"]').text()).toBe(
    "August",
  );

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

  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);

  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");

  const buttons = wrapper
    .get('[data-testid="month-popover"]')
    .findAll("button");
  expect(buttons).toHaveLength(12);
  const currentMonthIndex = 6;
  const currentMonthClasses = buttons[currentMonthIndex].classes();
  for (let i = 0; i < buttons.length; i++) {
    expect(buttons[i].text()).toBe(months[i]);

    if (i !== currentMonthIndex) {
      expect(buttons[i].classes()).not.toStrictEqual(currentMonthClasses);
    }
  }

  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");
  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);
});

test("Select month", async () => {
  const date = new Date(2024, 6); // July 2024
  vi.setSystemTime(date);

  const wrapper = mount(Calendar);

  // Select January
  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");
  let buttons = wrapper.get('[data-testid="month-popover"]').findAll("button");

  await buttons[0].trigger("click");

  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);

  expect(wrapper.get('[data-testid="month-popover-btn"]').text()).toBe(
    "January",
  );

  let table = wrapper.get("table");
  let tbody = table.get("tbody");
  let tds = tbody.findAll("td");

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
  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");
  buttons = wrapper.get('[data-testid="month-popover"]').findAll("button");

  await buttons[11].trigger("click");
  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);

  expect(wrapper.get('[data-testid="month-popover-btn"]').text()).toBe(
    "December",
  );

  table = wrapper.get("table");
  tbody = table.get("tbody");
  tds = tbody.findAll("td");

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

test("Closing month popover by clicking outside of it", async () => {
  const wrapper = mount(Calendar, { attachTo: document.body });

  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");
  wrapper.get('[data-testid="month-popover"]');

  // click inside
  await wrapper.get('[data-testid="month-popover"]').trigger("click");
  wrapper.get('[data-testid="month-popover"]');

  // click outside
  await wrapper.trigger("click");
  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);

  wrapper.unmount();
});

test("Closing month popover by pressing Esc", async () => {
  const wrapper = mount(Calendar, { attachTo: document.body });

  await wrapper.get('[data-testid="month-popover-btn"]').trigger("click");
  wrapper.get('[data-testid="month-popover"]');

  await wrapper.trigger("keyup", { code: "Escape" });
  expect(wrapper.find('[data-testid="month-popover"]').exists()).toBe(false);

  wrapper.unmount();
});
