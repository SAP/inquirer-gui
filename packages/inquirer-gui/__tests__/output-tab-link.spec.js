/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import InputVue from "../src/packages/QuestionInput.vue";
import OutputTabLink from "../src/packages/OutputTabLink.vue";
import utils from "./utils";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

global.visualViewport = {
  addEventListener: () => {},
  removeEventListener: () => {},
  width: 1024,
  height: 768,
  offsetLeft: 0,
  offsetTop: 0,
  pageLeft: 0,
  pageTop: 0,
  scale: 1,
};

const vscodeStubs = {
  VscodeTextfield: {
    template: `<div><input type="text" :value="value" @input="$emit('update:value', $event.target.value)" /></div>`,
    props: ["value", "placeholder"],
  },
};

// --- Question definitions ---

const questionWithFunctionOutputTabLink = [
  {
    type: "input",
    name: "trigger",
    message: "Trigger input",
    default: "initial",
  },
  {
    type: "input",
    name: "main",
    message: "Main input",
    validate: () => "always invalid",
    showOutputTabLink: async (answer, answers) => {
      if (answers.trigger === "show") {
        return { show: true, linkMessage: "Custom link message" };
      }
      if (answers.trigger === "show-no-msg") {
        return true;
      }
      return false;
    },
  },
];

const questionWithOverflowOutputTabLink = [
  {
    type: "input",
    name: "overflowing",
    message: "Overflow input",
    validate: () => "always invalid",
    showOutputTabLink: "validationMessageOverflow",
  },
];

const questionWithOverflowAndHint = [
  {
    type: "input",
    name: "hinted",
    message: "Input with hint",
    guiOptions: { hint: "Some hint" },
    validate: () => "always invalid",
    showOutputTabLink: "validationMessageOverflow",
  },
];

enableAutoUnmount(afterEach);

describe("OutputTabLink component", () => {
  test("renders default link message when no linkMessage prop provided", () => {
    const wrapper = mount(OutputTabLink);
    expect(wrapper.find("a").text()).toBe("View details in the output tab.");
  });

  test("renders custom linkMessage when prop is provided", () => {
    const wrapper = mount(OutputTabLink, {
      props: { linkMessage: "See the output tab for more info." },
    });
    expect(wrapper.find("a").text()).toBe("See the output tab for more info.");
  });

  test("emits show-output-tab-link when link is clicked", async () => {
    const wrapper = mount(OutputTabLink);
    await wrapper.find("a").trigger("click");
    expect(wrapper.emitted("show-output-tab-link")).toBeTruthy();
    expect(wrapper.emitted("show-output-tab-link").length).toBe(1);
  });
});

describe("OutputTabLink — function-based showOutputTabLink", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({ components });
  });

  test("initializes _showOutputTabLink and _outputTabLinkMessage to defaults in 1st pass", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(100);

    // 1st pass must initialize these so they don't carry stale values
    expect(wrapper.vm.questions[1]._showOutputTabLink).toBe(false);
    expect(wrapper.vm.questions[1]._outputTabLinkMessage).toBeUndefined();
  });

  test("output tab link not visible by default (showOutputTabLink returns false)", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("output tab link appears and has custom message when showOutputTabLink returns { show: true, linkMessage }", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    // Trigger the show condition
    const inputs = wrapper.findAll("input");
    inputs.at(0).setValue("show");
    await utils.sleep(300);

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
    expect(wrapper.findComponent(OutputTabLink).props("linkMessage")).toBe("Custom link message");
  });

  test("output tab link appears with default message when showOutputTabLink returns plain true", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    const inputs = wrapper.findAll("input");
    inputs.at(0).setValue("show-no-msg");
    await utils.sleep(300);

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
    expect(wrapper.findComponent(OutputTabLink).props("linkMessage")).toBeUndefined();
  });

  test("output tab link disappears when showOutputTabLink returns false again", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    // Show first
    const inputs = wrapper.findAll("input");
    inputs.at(0).setValue("show");
    await utils.sleep(300);
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);

    // Then hide
    inputs.at(0).setValue("hide");
    await utils.sleep(300);
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("emits showOutputTabLink event when the link is clicked", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    const inputs = wrapper.findAll("input");
    inputs.at(0).setValue("show");
    await utils.sleep(300);

    await wrapper.findComponent(OutputTabLink).find("a").trigger("click");
    expect(wrapper.emitted("showOutputTabLink")).toBeTruthy();
  });
});

describe("OutputTabLink — validationMessageOverflow mode", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({ components });
  });

  test("output tab link not shown when no overflow detected", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    // Enter invalid answer to trigger validation
    const input = wrapper.find("input");
    input.setValue("x");
    await utils.sleep(300);

    // No overflow by default in jsdom → link should not appear
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("output tab link shown when overflow is detected", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    // Simulate overflow: set errorTextOverflow directly on the vm
    const name = questionWithOverflowOutputTabLink[0].name;
    wrapper.vm.errorTextOverflow = { [name]: true };
    // Mark as dirty to satisfy shouldShowValidationMessage guard
    wrapper.vm.questions[0].isDirty = true;
    wrapper.vm.questions[0].__origAnswer = "";
    await nextTick();

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
  });

  test("output tab link not shown for overflow mode when validation message is hidden (hint+not-dirty guard)", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowAndHint });
    await nextTick();
    await utils.sleep(300);

    const name = questionWithOverflowAndHint[0].name;
    // Force overflow but do NOT set __origAnswer or isDirty — shouldShowValidationMessage returns false
    wrapper.vm.errorTextOverflow = { [name]: true };
    // question.isDirty = false (default), __origAnswer = undefined (default)
    await nextTick();

    // The link must NOT appear because shouldShowValidationMessage is false for this question
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("shouldShowOutputTabLink returns false when no showOutputTabLink property", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: [{ type: "input", name: "plain", message: "Plain" }] });
    await nextTick();

    expect(wrapper.vm.shouldShowOutputTabLink(wrapper.vm.questions[0])).toBe(false);
  });

  test("_updateErrorTextOverflow sets overflow to false when content fits (clientHeight >= scrollHeight)", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    const name = questionWithOverflowOutputTabLink[0].name;
    // Inject a fake DOM element where content does NOT overflow
    const fakeEl = {
      clientHeight: 40,
      scrollHeight: 30,
      style: {},
    };
    wrapper.vm._errorTextRefs = { [name]: fakeEl };
    wrapper.vm._updateErrorTextOverflow();
    await nextTick();
    await nextTick();

    expect(wrapper.vm.errorTextOverflow[name]).toBe(false);
  });

  test("_updateErrorTextOverflow sets overflow to true when content exceeds clamped height", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await nextTick();
    await utils.sleep(300);

    const name = questionWithOverflowOutputTabLink[0].name;
    // Inject a fake DOM element where full height exceeds clamped height
    const fakeEl = {
      clientHeight: 20,
      scrollHeight: 60,
      style: {},
    };
    wrapper.vm._errorTextRefs = { [name]: fakeEl };
    wrapper.vm._updateErrorTextOverflow();
    await nextTick();
    await nextTick();

    expect(wrapper.vm.errorTextOverflow[name]).toBe(true);
  });
});
