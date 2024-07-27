<script setup lang="ts">
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { computed, ref } from "vue";

type Cell = {
  isCurrentMonth: boolean;
  value: number;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS_IN_A_WEEK = 7;
const currentDate = ref(new Date());

const rows = computed<Cell[][]>(() => {
  const firstDayOfMonth = startOfMonth(currentDate.value);
  const startIndex = getDay(firstDayOfMonth);
  const daysInMonth = getDaysInMonth(currentDate.value);
  const daysInPreviousMonth = getDaysInMonth(subMonths(currentDate.value, 1));

  let rows = Math.ceil((startIndex + daysInMonth) / DAYS_IN_A_WEEK);
  const cells: Cell[] = new Array(DAYS_IN_A_WEEK * rows).fill({
    currentMonth: false,
    value: 0,
  });

  let day = 1;
  let isCurrentMonth = true;
  for (let i = 0; i < cells.length; i++) {
    if (i < startIndex) {
      cells[i] = {
        isCurrentMonth: false,
        value: daysInPreviousMonth - startIndex + i + 1,
      };
      continue;
    }

    if (day > daysInMonth) {
      day = 1;
      isCurrentMonth = false;
    }

    cells[i] = {
      value: day,
      isCurrentMonth,
    };
    day++;
  }

  const result: Cell[][] = [];
  const max = cells.length / DAYS_IN_A_WEEK;
  for (let i = 0; i < max; i++) {
    const start = i * DAYS_IN_A_WEEK;
    const end = start + DAYS_IN_A_WEEK;
    result.push(cells.slice(start, end));
  }

  return result;
});
</script>

<template>
  <h1 class="text-center">{{ format(currentDate, "MMMM yyyy") }}</h1>
  <div class="flex gap-4 justify-center">
    <button
      @click="currentDate = subMonths(currentDate, 1)"
      data-testid="prev-month-btn"
    >
      <
    </button>
    <button
      @click="currentDate = addMonths(currentDate, 1)"
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
</template>
