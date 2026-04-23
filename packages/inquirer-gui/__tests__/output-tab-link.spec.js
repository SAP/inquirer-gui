/* eslint-disable no-undef */
import { mount, enableAutoUnmount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import InputVue from "../src/packages/QuestionInput.vue";
import OutputTabLink from "../src/packages/OutputTabLink.vue";
// ResizeObserver polyfill is provided by setup.js (which also captures the callback,
// enabling the _resizeObserver callback test below).

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
    await flushPromises();

    // 1st pass sets these synchronously; 2nd-pass async call (trigger==="initial") also
    // resolves to false. flushPromises() ensures the async call has completed too.
    expect(wrapper.vm.questions[1]._showOutputTabLink).toBe(false);
    expect(wrapper.vm.questions[1]._outputTabLinkMessage).toBeUndefined();
  });

  test("output tab link not visible by default (showOutputTabLink returns false)", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await flushPromises();

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("output tab link appears and has custom message when showOutputTabLink returns { show: true, linkMessage }", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await flushPromises();

    // Trigger the show condition
    const inputs = wrapper.findAll("input");
    await inputs.at(0).setValue("show");
    await flushPromises();

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
    expect(wrapper.findComponent(OutputTabLink).props("linkMessage")).toBe("Custom link message");
  });

  test("output tab link appears with default message when showOutputTabLink returns plain true", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await flushPromises();

    const inputs = wrapper.findAll("input");
    await inputs.at(0).setValue("show-no-msg");
    await flushPromises();

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
    expect(wrapper.findComponent(OutputTabLink).props("linkMessage")).toBeUndefined();
  });

  test("output tab link disappears when showOutputTabLink returns false again", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await flushPromises();

    // Show first
    const inputs = wrapper.findAll("input");
    await inputs.at(0).setValue("show");
    await flushPromises();
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);

    // Then hide
    await inputs.at(0).setValue("hide");
    await flushPromises();
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("emits showOutputTabLink event when the link is clicked", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithFunctionOutputTabLink });
    await flushPromises();

    const inputs = wrapper.findAll("input");
    await inputs.at(0).setValue("show");
    await flushPromises();

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
    await flushPromises();

    // Enter invalid answer to trigger validation
    const input = wrapper.find("input");
    await input.setValue("x");
    await flushPromises();

    // No overflow by default in jsdom → link should not appear
    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(false);
  });

  test("output tab link shown when overflow is detected", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await flushPromises();

    // Simulate overflow by setting errorTextOverflow directly.
    // No isDirty or __origAnswer mutation is needed: questionWithOverflowOutputTabLink has no
    // guiOptions.hint, so the hint+not-dirty guard in shouldShowOutputTabLink is always true.
    const name = questionWithOverflowOutputTabLink[0].name;
    wrapper.vm.errorTextOverflow = { [name]: true };
    await nextTick();

    expect(wrapper.findComponent(OutputTabLink).exists()).toBe(true);
  });

  test("output tab link not shown for overflow mode when validation message is hidden (hint+not-dirty guard)", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowAndHint });
    await flushPromises();

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
    await flushPromises();

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
    await flushPromises();

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

  test("ResizeObserver callback triggers _updateErrorTextOverflow on width change", async () => {
    const wrapper = mount(FormVue, {
      global: { plugins: [vuetify], stubs: vscodeStubs, components: { QuestionInput: InputVue } },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionWithOverflowOutputTabLink });
    await flushPromises();

    const name = questionWithOverflowOutputTabLink[0].name;
    // Inject a fake DOM element that overflows
    const fakeEl = { clientHeight: 20, scrollHeight: 60, style: {} };
    wrapper.vm._errorTextRefs = { [name]: fakeEl };

    // Fire the ResizeObserver callback with a width different from the initial 0 (jsdom).
    // The callback only calls _updateErrorTextOverflow when the width changes.
    wrapper.vm._resizeObserver._callback([{ contentRect: { width: 500 } }]);
    await nextTick();

    expect(wrapper.vm.errorTextOverflow[name]).toBe(true);
  });
});
