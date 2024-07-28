import { defineComponent } from "vue";
import { useAddEventListener } from "./useAddEventListener";
import { mount } from "@vue/test-utils";

test("Add and remove event listener", () => {
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();
  const mockDocument = document;
  mockDocument.addEventListener = mockAddEventListener;
  mockDocument.removeEventListener = mockRemoveEventListener;
  vi.stubGlobal("document", mockDocument);

  const TestComponent = defineComponent({
    setup() {
      useAddEventListener({
        event: "keyup",
        listener() {},
      });
    },
    render() {},
  });

  const wrapper = mount(TestComponent);
  expect(mockAddEventListener).toHaveBeenCalledOnce();

  wrapper.unmount();
  expect(mockAddEventListener).toHaveBeenCalledOnce();
});
