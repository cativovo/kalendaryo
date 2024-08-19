import { mount } from "@vue/test-utils";
import Popover from "./Popover.vue";

const options = Array.from({ length: 12 }, (_, i) => i);

test("Popover is rendering properly with default selected", async () => {
  const selected = 4;
  const wrapper = mount(Popover, {
    props: {
      label: "popover",
      options,
      selected,
    },
  });

  expect(wrapper.get('[data-testid="popover-btn"]').text()).toBe("popover");
  expect(wrapper.find('[data-testid="popover"]').exists()).toBe(false);

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  expect(wrapper.find('[data-testid="popover"]').exists()).toBe(true);

  const buttons = wrapper.findAll('[data-testid="popover"] > button');
  expect(buttons).toHaveLength(options.length);
  buttons.forEach((button, i) => {
    if (i === selected) {
      expect(button.text()).toBe(selected.toString());
      expect(button.attributes("data-testid")).toBe("option-selected");
    } else {
      expect(button.attributes("data-testid")).toBe(undefined);
    }
  });

  await buttons[4].trigger("click");
  expect(wrapper.find('data-testid="popover"').exists()).toBe(false);
});

test("Popover is rendering properly without default selected", async () => {
  const wrapper = mount(Popover, {
    props: {
      label: "popover",
      options,
    },
  });

  expect(wrapper.get('[data-testid="popover-btn"]').text()).toBe("popover");
  expect(wrapper.find('[data-testid="popover"]').exists()).toBe(false);

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  expect(wrapper.find('[data-testid="popover"]').exists()).toBe(true);

  const buttons = wrapper.findAll('[data-testid="popover"] > button');
  expect(buttons).toHaveLength(options.length);
  buttons.forEach((button) => {
    expect(button.attributes("data-testid")).toBe(undefined);
  });

  await buttons[4].trigger("click");
  expect(wrapper.find('data-testid="popover"').exists()).toBe(false);
});

test("Can select option", async () => {
  const wrapper = mount(Popover, {
    props: {
      label: "popover",
      options,
    },
  });

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");
  wrapper.get('[data-testid="popover"] > button:nth-child(4)').trigger("click");

  const selectEvent = wrapper.emitted("select")!;
  expect(selectEvent).toHaveLength(1);
  // nth-child() starts on 1
  expect(selectEvent[0]).toEqual([3]);

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  wrapper.findAll('[data-testid="popover"] > button').forEach((button, i) => {
    if (i === 3) {
      expect(button.attributes("data-testid")).toBe("option-selected");
    } else {
      expect(button.attributes("data-testid")).toBe(undefined);
    }
  });
});

test("Can change selected using props", async () => {
  const props = {
    label: "popover",
    selected: 0,
    options,
  };
  const wrapper = mount(Popover, {
    props,
  });

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  wrapper.findAll('[data-testid="popover"] > button').forEach((button, i) => {
    if (i === 0) {
      expect(button.attributes("data-testid")).toBe("option-selected");
    } else {
      expect(button.attributes("data-testid")).toBe(undefined);
    }
  });

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  wrapper.setProps({ ...props, selected: 9 });

  await wrapper.get('[data-testid="popover-btn"]').trigger("click");

  wrapper.findAll('[data-testid="popover"] > button').forEach((button, i) => {
    if (i === 9) {
      expect(button.attributes("data-testid")).toBe("option-selected");
    } else {
      expect(button.attributes("data-testid")).toBe(undefined);
    }
  });
});
