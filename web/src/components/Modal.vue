<script setup lang="ts">
import { X } from "lucide-vue-next";
import { Teleport, ref, onMounted, watchEffect, onUnmounted } from "vue";

type Props = {
  visible: boolean;
};
type Emits = {
  close: [];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const dialogRef = ref<HTMLDialogElement | null>(null);

function onClose() {
  emit("close");
  dialogRef.value?.close();
}

onMounted(() => {
  dialogRef.value?.addEventListener("close", onClose);
});

onUnmounted(() => {
  dialogRef.value?.removeEventListener("close", onClose);
});

watchEffect(() => {
  if (props.visible) {
    dialogRef.value?.showModal();
  }
});
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="relative p-4 rounded-md"
      data-testid="dialog"
    >
      <button
        @click="onClose"
        class="absolute top-1 right-1 p-1 text-gray-400"
        data-testid="dialog-close-button"
      >
        <X />
      </button>
      <slot />
    </dialog>
  </Teleport>
</template>

<style lang="css" scoped>
/* Dialog playground */
/* https://developer.mozilla.org/en-US/play */

/* Open state of the dialog  */
dialog[open] {
  opacity: 1;
}

/* Closed state of the dialog   */
dialog {
  opacity: 0;
  transition:
    opacity,
    overlay allow-discrete,
    display allow-discrete;
  transition-duration: 150ms;
}

/* Before-open state */
/* Needs to be after the previous dialog[open] rule to take effect, as the specificity is the same */
@starting-style {
  dialog[open] {
    opacity: 0;
  }
}

/* Transition the :backdrop when the dialog modal is promoted to the top layer */
dialog::backdrop {
  background-color: rgb(0 0 0 / 0);
  transition:
    display allow-discrete,
    overlay allow-discrete,
    background-color;
  transition-duration: 150ms;
}

dialog[open]::backdrop {
  background-color: rgb(0 0 0 / 0.25);
}

/* This starting-style rule cannot be nested inside the above selector
because the nesting selector cannot represent pseudo-elements. */
@starting-style {
  dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 0);
  }
}
</style>
