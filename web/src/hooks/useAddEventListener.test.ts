import { defineComponent } from "vue";
import { useAddEventListener } from "./useAddEventListener";
import { mount } from "@vue/test-utils";

test("Add and remove event listener", () => {
  const addEventListenerSpy = vi.spyOn(document, "addEventListener");
  const removeEventListenerSpy = vi.spyOn(document, "addEventListener");

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
  expect(addEventListenerSpy).toHaveBeenCalledOnce();

  wrapper.unmount();
  expect(removeEventListenerSpy).toHaveBeenCalledOnce();
});
