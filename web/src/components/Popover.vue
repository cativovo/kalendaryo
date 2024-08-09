<script setup lang="ts" generic="T extends number | string">
import { ref } from "vue";
import { useAddEventListeners } from "../hooks/useAddEventListeners";

type Props = {
  label: string;
  selected?: T;
  options: T[];
};

type Emits = {
  select: [T];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selected = ref(props.selected);
const isPopoverOpen = ref(false);
const popoverRef = ref<HTMLDivElement | null>(null);
const popoverAnchorRef = ref<HTMLElement | null>(null);

function select(option: T) {
  emit("select", option);
  selected.value = option;
  isPopoverOpen.value = false;
}

useAddEventListeners({
  keydown(e) {
    if (e.code === "Escape") {
      isPopoverOpen.value = false;
    }
  },
  click(e) {
    if (
      e.target &&
      !popoverRef.value?.contains(e.target as Node) &&
      !popoverAnchorRef.value?.contains(e.target as Node)
    ) {
      isPopoverOpen.value = false;
    }
  },
});
</script>

<template>
  <div>
    <div class="inline-block relative">
      <button
        @click="isPopoverOpen = !isPopoverOpen"
        ref="popoverAnchorRef"
        data-testid="popover-btn"
        @blur="isPopoverOpen = false"
      >
        {{ props.label }}
      </button>
      <Transition>
        <div
          v-if="isPopoverOpen"
          class="grid absolute right-1/2 z-50 grid-cols-[repeat(3,1fr)] gap-2 p-2 bg-white border translate-x-1/2"
          ref="popoverRef"
          data-testid="popover"
        >
          <button
            v-for="option in props.options"
            :key="option"
            @click="select(option)"
            class="py-1 transition-colors hover:bg-gray-100"
            :class="selected === option && 'bg-blue-200'"
            :data-testid="selected === option ? 'option-selected' : undefined"
            @mousedown.prevent
          >
            {{ option }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
