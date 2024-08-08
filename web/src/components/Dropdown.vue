<script setup lang="ts" generic="T extends string | number">
import { computed, ref, watch } from "vue";
import { ChevronDown } from "lucide-vue-next";

type Props = {
  options: T[];
  selected?: T;
};

type Emits = {
  select: [v: T];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedRef = ref<Element | null>(null);
const anchorRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

const isDropdownOpen = ref(false);
const selected = ref(props.selected);
const query = ref<string>("");
const activeOptionIndex = ref<number>(0);

function openDropdown() {
  isDropdownOpen.value = true;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

function select(option: T) {
  selected.value = option;
  emit("select", option);
  closeDropdown();
}

function scrollToActiveOption(index: number) {
  listRef.value?.children[index].scrollIntoView({
    behavior: "instant",
    block: "center",
  });
}

function handleKeydown(e: KeyboardEvent) {
  // FIXME: keyboard navigation breaks if there's a hovered option
  if (e.code === "ArrowDown") {
    activeOptionIndex.value =
      activeOptionIndex.value === filteredOptions.value.length - 1
        ? 0
        : activeOptionIndex.value + 1;
    scrollToActiveOption(activeOptionIndex.value);
    return;
  }

  if (e.code === "ArrowUp") {
    activeOptionIndex.value =
      activeOptionIndex.value === 0
        ? filteredOptions.value.length - 1
        : activeOptionIndex.value - 1;
    scrollToActiveOption(activeOptionIndex.value);
    return;
  }

  if (e.code === "Enter") {
    // TODO: refactor to use 'vue' way
    listRef.value?.children[activeOptionIndex.value]
      .querySelector("button")
      ?.click();
    return;
  }

  activeOptionIndex.value = 0;
  if (listRef.value) {
    listRef.value.scrollTop = 0;
  }
}

function setSelectedRef(option: T) {
  return (ref: Element): undefined => {
    if (option === selected.value) {
      selectedRef.value = ref;
    }
  };
}

function setOptionTestId(option: T, i: number) {
  const testIds = [
    selected.value === option && "option-selected",
    activeOptionIndex.value === i && "option-active",
  ].filter(Boolean);

  if (testIds.length === 0) {
    return undefined;
  }

  return testIds.join(" ");
}

const filteredOptions = computed(() =>
  props.options.filter((v) => v.toString().includes(query.value)),
);

watch(selectedRef, () => {
  if (isDropdownOpen.value && !query.value) {
    selectedRef.value?.scrollIntoView({ behavior: "instant" });
  }
});

watch(isDropdownOpen, () => {
  if (!isDropdownOpen.value) {
    query.value = "";
  } else {
    inputRef.value?.focus();
  }
});

watch(
  [filteredOptions, selectedRef, selected, query],
  () => {
    if (!query.value) {
      const i = filteredOptions.value.findIndex((v) => v === selected.value);
      if (i > -1) {
        activeOptionIndex.value = i;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="inline-block relative" ref="anchorRef">
    <div class="inline-block relative border cursor-pointer">
      <span
        data-testid="selected"
        class="absolute py-1 px-2"
        v-if="!query"
        @click="openDropdown()"
        >{{ selected }}</span
      >
      <input
        type="text"
        class="py-1 px-2 w-full outline-none"
        v-model="query"
        ref="inputRef"
        @click="openDropdown()"
        @focus="openDropdown()"
        @blur="closeDropdown()"
        @keydown="handleKeydown($event)"
      />
      <button
        v-if="query"
        class="absolute right-8 top-1/2 -translate-y-1/2"
        @mousedown="$event.preventDefault()"
        @click="query = ''"
      >
        &times;
      </button>
      <button
        @mousedown="$event.preventDefault()"
        class="absolute right-2 top-1/2 -translate-y-1/2"
        @click="openDropdown()"
      >
        <ChevronDown class="text-gray-300" />
      </button>
    </div>
    <ul
      class="overflow-y-scroll absolute right-0 left-0 py-1 max-h-36 bg-white border divide-y"
      v-if="isDropdownOpen"
      ref="listRef"
    >
      <li
        v-if="filteredOptions.length > 0"
        v-for="(option, i) in filteredOptions"
        :data-testid="setOptionTestId(option, i)"
        :key="`${option}-${i}`"
        :ref="setSelectedRef(option)"
      >
        <!-- preventDefault on mousedown to make sure the input above don't lose focus -->
        <button
          :class="[
            selected === option && 'bg-blue-200',
            activeOptionIndex === i && selected !== option && 'bg-gray-100',
            'w-full text-left p-1',
          ]"
          @click="select(option)"
          @mousedown="$event.preventDefault()"
          @mouseover="activeOptionIndex = i"
        >
          {{ option }}
        </button>
      </li>
      <li v-else>No options</li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
div:has(input:focus) {
  @apply border-sky-500;
}
</style>
