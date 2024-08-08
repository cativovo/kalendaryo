<script setup lang="ts">
import {
  addMonths,
  format,
  formatDate,
  getDay,
  getDaysInMonth,
  setMonth,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import { computed, ref } from "vue";
import { useAddEventListeners } from "../hooks/useAddEventListeners";
import Dropdown from "./Dropdown.vue";

type Cell = {
  isCurrentMonth: boolean;
  value: number;
};

const MONTHS = [
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

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS_IN_A_WEEK = 7;
const YEAR_FORMAT = "yyyy";
const MONTH_FORMAT = "MMMM";

const currentDate = new Date();
const currentMonthString = formatDate(currentDate, MONTH_FORMAT);
const range = 20;
const currentYearInt = parseInt(formatDate(currentDate, YEAR_FORMAT));
const years = Array.from({ length: 40 }, (_, i) => {
  return currentYearInt + i - range;
});

const selectedDate = ref(currentDate);
const isMonthPopoverOpen = ref(false);
const monthPopoverRef = ref<HTMLDivElement | null>(null);
const monthPopoverAnchorRef = ref<HTMLElement | null>(null);

useAddEventListeners({
  keyup(e) {
    if (e.code === "Escape") {
      isMonthPopoverOpen.value = false;
    }
  },
  click(e) {
    if (
      e.target &&
      !monthPopoverRef.value?.contains(e.target as Node) &&
      !monthPopoverAnchorRef.value?.contains(e.target as Node)
    ) {
      isMonthPopoverOpen.value = false;
    }
  },
});

const rows = computed<Cell[][]>(() => {
  const firstDayOfMonth = startOfMonth(selectedDate.value);
  const startIndex = getDay(firstDayOfMonth);
  const daysInMonth = getDaysInMonth(selectedDate.value);
  const daysInPreviousMonth = getDaysInMonth(subMonths(selectedDate.value, 1));

  let rows = Math.ceil((startIndex + daysInMonth) / DAYS_IN_A_WEEK);
  let day = 1;
  let isCurrentMonth = true;
  const cells = Array.from({ length: DAYS_IN_A_WEEK * rows }, (_, i) => {
    if (i < startIndex) {
      return {
        isCurrentMonth: false,
        value: daysInPreviousMonth - startIndex + i + 1,
      };
    }

    if (day > daysInMonth) {
      day = 1;
      isCurrentMonth = false;
    }

    const cell = {
      value: day,
      isCurrentMonth,
    };

    day++;
    return cell;
  });

  return Array.from({ length: cells.length / DAYS_IN_A_WEEK }, (_, i) => {
    const start = i * DAYS_IN_A_WEEK;
    const end = start + DAYS_IN_A_WEEK;
    return cells.slice(start, end);
  });
});

const selectedMonth = computed(() =>
  formatDate(selectedDate.value, MONTH_FORMAT),
);

const selectedYear = computed(() =>
  parseInt(formatDate(selectedDate.value, YEAR_FORMAT)),
);

function updateMonth(month: string) {
  selectedDate.value = setMonth(selectedDate.value, MONTHS.indexOf(month));
  isMonthPopoverOpen.value = false;
}

function updateYear(year: number) {
  selectedDate.value = setYear(selectedDate.value, year);
}
</script>

<template>
  <div>
    <div class="text-center">
      <div class="relative">
        <button
          @click="isMonthPopoverOpen = !isMonthPopoverOpen"
          ref="monthPopoverAnchorRef"
          data-testid="month-popover-btn"
        >
          {{ selectedMonth }}
        </button>
        <Transition>
          <div
            v-if="isMonthPopoverOpen"
            class="grid absolute right-1/2 grid-cols-3 gap-2 p-2 bg-white border translate-x-1/2"
            ref="monthPopoverRef"
            data-testid="month-popover"
          >
            <button
              v-for="month in MONTHS"
              :key="month"
              @click="updateMonth(month)"
              class="py-1 transition-colors hover:bg-gray-100"
              :class="currentMonthString === month && 'bg-gray-300'"
            >
              {{ month }}
            </button>
          </div>
        </Transition>
      </div>
      <span data-testid="year-select">{{ selectedYear }}</span>
      <Dropdown
        :options="years"
        :selected="selectedYear"
        @select="updateYear"
      />
    </div>
    <div class="flex gap-4 justify-center">
      <button
        @click="selectedDate = subMonths(selectedDate, 1)"
        data-testid="prev-month-btn"
      >
        <
      </button>
      <button
        @click="selectedDate = addMonths(selectedDate, 1)"
        data-testid="next-month-btn"
      >
        >
      </button>
    </div>
    <div class="mx-auto max-w-lg">
      <table class="mt-8 w-full border border-collapse">
        <thead>
          <tr>
            <th v-for="day in DAYS" :key="day" class="text-center border">
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td
              v-for="(cell, j) in row"
              :key="j"
              class="text-center border"
              :class="!cell.isCurrentMonth && 'text-gray-400'"
            >
              {{ cell.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-opacity;
}

.v-enter-from,
.v-leave-to {
  @apply opacity-0;
}
</style>
