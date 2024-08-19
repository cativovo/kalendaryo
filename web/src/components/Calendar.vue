<script setup lang="ts">
import {
  addMonths,
  formatDate,
  getDay,
  getDaysInMonth,
  setMonth,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns";
import { computed, ref } from "vue";
import Dropdown from "./Dropdown.vue";
import Popover from "./Popover.vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

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
const range = 20;
const currentYearInt = parseInt(formatDate(currentDate, YEAR_FORMAT));
const years = Array.from({ length: 40 }, (_, i) => {
  return currentYearInt + i - range;
});

const selectedDate = ref(currentDate);

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
}

function updateYear(year: number) {
  selectedDate.value = setYear(selectedDate.value, year);
}
</script>

<template>
  <div class="mt-4">
    <div class="flex gap-2 justify-center">
      <button
        @click="selectedDate = subMonths(selectedDate, 1)"
        data-testid="prev-month-btn"
        class="text-gray-400 transition-colors hover:text-gray-300"
      >
        <ChevronLeft />
      </button>
      <Popover
        data-testid="month-popover"
        :label="selectedMonth"
        :selected="selectedMonth"
        :options="MONTHS"
        @select="updateMonth"
      />
      <Dropdown
        :options="years"
        :selected="selectedYear"
        @select="updateYear"
        class="w-28"
        data-testid="year-select"
      />
      <button
        @click="selectedDate = addMonths(selectedDate, 1)"
        data-testid="next-month-btn"
        class="text-gray-400 transition-colors hover:text-gray-300"
      >
        <ChevronRight />
      </button>
    </div>
    <div class="mx-auto mt-6 max-w-lg">
      <table class="w-full border border-collapse">
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
