import { onMounted, onUnmounted } from "vue";

type Listener<K extends keyof DocumentEventMap> = (
  e: DocumentEventMap[K],
) => void | Promise<void>;

type EventMap<T extends keyof DocumentEventMap> = {
  [K in T]: Listener<K>;
};

export function useAddEventListeners<T extends keyof DocumentEventMap>(
  eventMap: EventMap<T>,
) {
  onMounted(() => {
    for (const [event, listener] of Object.entries(eventMap)) {
      document.addEventListener(event as T, listener as Listener<T>);
    }
  });

  onUnmounted(() => {
    for (const [event, listener] of Object.entries(eventMap)) {
      document.removeEventListener(event as T, listener as Listener<T>);
    }
  });
}
