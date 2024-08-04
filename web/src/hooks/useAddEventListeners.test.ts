import { defineComponent } from "vue";
import { useAddEventListeners } from "./useAddEventListeners";
import { mount } from "@vue/test-utils";

test("Add and remove event listeners", () => {
  const keyupMock = vi.fn();
  const clickMock = vi.fn();

  const TestComponent = defineComponent({
    setup() {
      useAddEventListeners({
        keyup: keyupMock,
        click: clickMock,
      });
    },
    render() {},
  });

  // test addEventListener
  const wrapper = mount(TestComponent, {
    attachTo: document.body,
  });

  document.dispatchEvent(new KeyboardEvent("keyup"));
  document.dispatchEvent(new Event("click"));

  expect(keyupMock).toHaveBeenCalledOnce();
  expect(clickMock).toHaveBeenCalledOnce();

  // test removeEventListener
  wrapper.unmount();
  keyupMock.mockClear();
  clickMock.mockClear();

  document.dispatchEvent(new KeyboardEvent("keyup"));
  document.dispatchEvent(new Event("click"));

  expect(keyupMock).not.toHaveBeenCalledOnce();
  expect(clickMock).not.toHaveBeenCalledOnce();
});
