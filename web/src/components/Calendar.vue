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
