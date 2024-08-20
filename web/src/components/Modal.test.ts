import { mount } from "@vue/test-utils";
import Modal from "./Modal.vue";
import { nextTick } from "vue";

test("Modal is rendering properly", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const defaultSlot = "<div>eyyyyy</div>";

  const wrapper = mount(Modal, {
    props: {
      visible: false,
    },
    slots: {
      default: defaultSlot,
    },
    attachTo: container,
  });

  await nextTick();

  expect(container.innerHTML).not.contains(defaultSlot);
  expect(document.body.children).toHaveLength(2);
  expect(document.body.children[1].innerHTML).toContain(defaultSlot);

  expect(
    document.body.querySelector('[data-testid="dialog"]')?.hasAttribute("open"),
  ).toBe(false);

  wrapper.setProps({ visible: true });
  await nextTick();

  expect(
    document.body.querySelector('[data-testid="dialog"]')?.hasAttribute("open"),
  ).toBe(true);

  wrapper.unmount();
});
