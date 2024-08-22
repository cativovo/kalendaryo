import { mount } from "@vue/test-utils";
import Modal from "./Modal.vue";

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

  expect(container.innerHTML).not.contains(defaultSlot);
  expect(document.body.children).toHaveLength(2);
  expect(document.body.children[1].innerHTML).toContain(defaultSlot);

  expect(
    document.body.querySelector('[data-testid="dialog"]')?.hasAttribute("open"),
  ).toBe(false);

  await wrapper.setProps({ visible: true });

  expect(
    document.body.querySelector('[data-testid="dialog"]')?.hasAttribute("open"),
  ).toBe(true);

  wrapper.unmount();
});

test("Emits close event when close button is clicked", async () => {
  const wrapper = mount(Modal, {
    props: {
      visible: true,
    },
    slots: {
      default: "<div>eyyyyy</div>",
    },
    global: {
      stubs: {
        teleport: true,
      },
    },
  });

  await wrapper
    .get<HTMLButtonElement>('[data-testid="dialog-close-button"]')
    .trigger("click");

  const event = wrapper.emitted("close")!;
  expect(event).toHaveLength(1);
});

test("Emits close event when <dialog> is closed", async () => {
  const wrapper = mount(Modal, {
    props: {
      visible: true,
    },
    slots: {
      default: "<div>eyyyyy</div>",
    },
    global: {
      stubs: {
        teleport: true,
      },
    },
  });

  await wrapper
    .get<HTMLDialogElement>('[data-testid="dialog"]')
    .trigger("close");

  const event = wrapper.emitted("close")!;
  expect(event).toHaveLength(1);
});
