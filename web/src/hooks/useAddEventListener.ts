import { onMounted, onUnmounted } from "vue";

type Options<T extends keyof DocumentEventMap> = {
  listener: (e: DocumentEventMap[T]) => void | Promise<void>;
  event: T;
};

export function useAddEventListener<T extends keyof DocumentEventMap>(
  options: Options<T>,
) {
  onMounted(() => {
    document.addEventListener(options.event, options.listener);
  });

  onUnmounted(() => {
    document.removeEventListener(options.event, options.listener);
  });
}
