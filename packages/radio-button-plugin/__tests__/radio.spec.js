/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../../inquirer-gui/src/Form.vue";

import RadioGroupPlugin from "../../radio-button-plugin/src";
import RadioGroup from "../src/packages/RadioGroup.vue";

// import RadioGroupPlugin from "@sap-devx/inquirer-gui-radio-plugin";

const questionRadio = [
  {
    type: "radio",
    name: "pat",
    message: "Your pat",
    choices: ["dog", "cat"],
    default: ["cat"],
  },
];

const questionRadioNoChoices = [
  {
    type: "radio",
    name: "pat",
    message: "Your pat",
  },
];

const questionRadioDisabled = [
  {
    type: "radio",
    name: "pat",
    message: "Your mood",
    choices: [
      "happy",
      {
        value: "sad",
        disabled: true,
      },
    ],
    default: "happy",
  },
];

enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test

describe("Question of type radio", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("Radio", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [RadioGroupPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionRadio });
    await nextTick();

    const pat = wrapper.find('input[type="radio"]'); //input[value="dog"]
    pat.trigger("click");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    console.log({ wrapper });
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].pat).toContain("dog");
  });

  test("should return the correct radio ID", () => {
    const wrapper = mount(RadioGroup, {
      props: {
        question: {
          name: "testQuestion",
          choices: ["choice1", "choice2"],
        },
      },
    });

    const radioId = wrapper.vm.getRadioId("testName");
    expect(radioId).toBe("radio_testName");
  });

  test("Radio button with missing choices array", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [RadioGroupPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionRadioNoChoices });
    await nextTick();

    const pat = wrapper.find('input[type="radio"]');
    expect(pat.exists()).toBe(false);
  });

  test("Radio button with one disabled option", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [RadioGroupPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionRadioDisabled });
    await nextTick();

    const pat = wrapper.find('input[value="sad"]');
    // Simulate a click on the disabled option
    pat.trigger("click");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].pat).toContain("happy");
  });
});
