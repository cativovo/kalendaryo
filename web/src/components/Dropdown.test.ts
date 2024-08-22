import { mount } from "@vue/test-utils";
import Dropdown from "./Dropdown.vue";

const options = Array.from({ length: 10 }, (_, i) => i);

test("Dropdown is rendering properly with default selected", async () => {
  const selected = 5;
  const wrapper = mount(Dropdown, {
    props: {
      options,
      selected,
    },
  });

  expect(wrapper.get('[data-testid="selected"]').text()).toBe("5");
  expect(wrapper.find("ul").exists()).toBe(false);

  await wrapper.get("input").trigger("click");

  expect(wrapper.find("ul").exists()).toBe(true);

  const lis = wrapper.findAll("ul > li");
  expect(lis).toHaveLength(options.length);
  lis.forEach((li, i) => {
    if (i === selected) {
      expect(li.attributes("data-testid")).toBe(
        "option-selected option-active",
      );
      expect(li.text()).toBe(selected.toString());
    } else {
      expect(li.attributes("data-testid")).toBe(undefined);
    }
  });
});

test("Dropdown is rendering properly without default selected", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
    },
  });

  expect(wrapper.get('[data-testid="selected"]').text()).toBe("");
  expect(wrapper.find("ul").exists()).toBe(false);

  await wrapper.get("input").trigger("click");

  expect(wrapper.find("ul").exists()).toBe(true);

  const lis = wrapper.findAll("ul > li");
  expect(lis).toHaveLength(options.length);
  lis.forEach((li, i) => {
    if (i === 0) {
      expect(li.attributes("data-testid")).toBe("option-active");
      expect(li.text()).toBe("0");
    } else {
      expect(li.attributes("data-testid")).toBe(undefined);
    }
  });
});

test("Can select option", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
    },
  });

  await wrapper.get("input").trigger("click");
  // nth-child() starts at 1
  await wrapper.get("ul > li:nth-child(7) > button").trigger("click");

  expect(wrapper.get('[data-testid="selected"]').text()).toBe("6");

  const selectEvent = wrapper.emitted("select")!;
  expect(selectEvent).toHaveLength(1);
  expect(selectEvent[0]).toEqual([6]);
  expect(wrapper.find("ul").exists()).toBe(false);

  await wrapper.get("input").trigger("click");
  expect(
    wrapper.get("ul > li:nth-child(7)").attributes("data-testid"),
  ).toContain("option-selected");
});

test("Update selected when prop.selected change", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
      selected: 5,
    },
  });

  await wrapper.get("input").trigger("click");
  expect(wrapper.get('[data-testid="selected"]').text()).toBe("5");

  await wrapper.setProps({ selected: 7 });
  await wrapper.get("input").trigger("click");
  expect(wrapper.get('[data-testid="selected"]').text()).toBe("7");
});

test("Focus changes with default select", async () => {
  const selected = 5;
  const wrapper = mount(Dropdown, {
    props: {
      options,
      selected,
    },
  });

  await wrapper.get("input").trigger("click");
  // nth-child() starts at 1
  expect(
    wrapper.get("ul > li:nth-child(6)").attributes("data-testid"),
  ).toContain("option-active");

  const arrowDownTimes = 4;
  for (let i = 0; i < arrowDownTimes; i++) {
    await wrapper.get("input").trigger("keydown", {
      code: "ArrowDown",
    });
  }

  wrapper.findAll("ul > li").forEach((li, i) => {
    if (i === arrowDownTimes + selected) {
      expect(li.attributes("data-testid")).toBe("option-active");
    } else {
      expect(li.attributes("data-testid")).not.toBe("option-active");
    }
  });

  const arrowUpTimes = 2;
  for (let i = 0; i < arrowUpTimes; i++) {
    await wrapper.get("input").trigger("keydown", {
      code: "ArrowUp",
    });
  }

  wrapper.findAll("ul > li").forEach((li, i) => {
    if (i === arrowDownTimes + selected - arrowUpTimes) {
      expect(li.attributes("data-testid")).toBe("option-active");
    } else {
      expect(li.attributes("data-testid")).not.toBe("option-active");
    }
  });
});

test("Focus changes without default select", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
    },
  });

  await wrapper.get("input").trigger("click");
  expect(
    wrapper.get("ul > li:nth-child(1)").attributes("data-testid"),
  ).toContain("option-active");

  const arrowDownTimes = 4;
  for (let i = 0; i < arrowDownTimes; i++) {
    await wrapper.get("input").trigger("keydown", {
      code: "ArrowDown",
    });
  }

  wrapper.findAll("ul > li").forEach((li, i) => {
    if (i === arrowDownTimes) {
      expect(li.attributes("data-testid")).toBe("option-active");
    } else {
      expect(li.attributes("data-testid")).not.toBe("option-active");
    }
  });

  const arrowUpTimes = 2;
  for (let i = 0; i < arrowUpTimes; i++) {
    await wrapper.get("input").trigger("keydown", {
      code: "ArrowUp",
    });
  }

  wrapper.findAll("ul > li").forEach((li, i) => {
    if (i === arrowDownTimes - arrowUpTimes) {
      expect(li.attributes("data-testid")).toBe("option-active");
    } else {
      expect(li.attributes("data-testid")).not.toBe("option-active");
    }
  });
});

test("Close dropdown when out of focus", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
    },
  });

  await wrapper.get("input").trigger("click");
  expect(wrapper.find("ul").exists()).toBe(true);
  await wrapper.get("input").trigger("blur");
  expect(wrapper.find("ul").exists()).toBe(false);
});

test("Can search", async () => {
  const evenOddOptions = options.map((v) =>
    v % 2 === 0 ? `even-${v}` : `odd-${v}`,
  );
  const wrapper = mount(Dropdown, {
    props: {
      options: evenOddOptions,
    },
  });

  await wrapper.get("input").trigger("click");

  await wrapper.get("input").setValue("even");
  const lis = wrapper.findAll("ul > li");
  expect(lis).toHaveLength(5);
  expect(lis.map((li) => li.text())).toEqual(
    options.map((v) => v % 2 === 0 && `even-${v}`).filter(Boolean),
  );

  await wrapper.get("input").setValue("odd-1");
  expect(wrapper.findAll("ul > li")).toHaveLength(1);
  expect(wrapper.get("ul > li:nth-child(1)").text()).toBe("odd-1");

  await wrapper.get("input").setValue("no option");
  expect(wrapper.findAll("ul > li")).toHaveLength(1);
  expect(wrapper.get("ul > li:nth-child(1)").text()).toBe("No options");
});

test("Can clear input", async () => {
  const wrapper = mount(Dropdown, {
    props: {
      options,
    },
  });

  await wrapper.get("input").trigger("click");
  await wrapper.get("input").setValue("test");
  expect(wrapper.get("input").element.value).toBe("test");
  expect(wrapper.findAll("ul > li")).toHaveLength(1);

  await wrapper.get("input + button").trigger("click");
  expect(wrapper.get("input").element.value).toBe("");
  expect(wrapper.findAll("ul > li")).toHaveLength(10);
});
