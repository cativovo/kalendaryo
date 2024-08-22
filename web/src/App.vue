<script setup lang="ts">
import Calendar from "./components/Calendar.vue";
</script>

<template>
  <Calendar @select="console.log" />
</template>
