/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";

import QuestionCheckbox from "../src/packages/QuestionCheckbox.vue";

import utils from "./utils";

const questionCheckbox = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China" },
      "Israel",
    ],
    default: ["Germany"],
  },
];

const questionCheckboxChoicesAsFunction = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: function () {
      return ["USA", "Germany"];
    },
    default: ["Germany"],
  },
];

const questionCheckboxDynamicChoicesAsFunction = [
  {
    type: "input",
    name: "country",
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: function (answers) {
      const response = ["USA", "Germany"];
      if (answers.country) {
        response.push(answers.country);
      }
      return response;
    },
    default: ["Germany"],
  },
];

const questionCheckboxChecked = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China", checked: true },
      "Israel",
    ],
    default: ["Germany", "China"],
  },
];

const questionCheckboxCheckedForceDefault = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China", checked: true },
      "Israel",
    ],
    default: ["Germany"],
    __ForceDefault: true,
  },
];

const objectValueChoices = [
  { name: "United States of America", value: { country: "USA", currency: "Dollar" } },
  "Germany",
  { name: "People's Republic of China", value: { country: "China", currency: "Yen" } },
];
const questionCheckboxCheckedObjectValues = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: objectValueChoices,
    default: [{ country: "China", currency: "Yen" }],
  },
];

const vscodeStubs = {
  VscodeDivider: {
    template: "<div></div>",
  },
  VscodeCheckbox: {
    template: "<div></div>",
  },
  VscodeTextfield: {
    template: `
      <div>
        <input
          type="text"
          :value="value"
          :placeholder="placeholder"
          @input="$emit('update:value', $event.target.value)"
          @change="$emit('change', $event)"
        />
      </div>
    `,
    props: ["value", "placeholder"],
  },
};

enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Question of type checkbox", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("Checkbox", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckbox });
    await nextTick();

    const citizenship = wrapper.findComponent({ name: "v-list-item" });
    citizenship.trigger("click");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });

  test("Checkbox with choices as function", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckboxChoicesAsFunction });
    await nextTick();
    await nextTick();

    const citizenship = wrapper.findComponent({ name: "v-list-item" });
    citizenship.trigger("click");

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });

  test("Checkbox with choices as function that return dynamic values", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckboxDynamicChoicesAsFunction });
    await nextTick();

    const name = wrapper.find("input");
    const country = "A country";
    name.element.value = country;
    name.trigger("input");

    // wait to account for debounce
    await utils.sleep(300);

    await nextTick();
    expect(wrapper.props("questions")[1]._choices[2].value).toBe(country);
  });

  test("Checkbox with checked choice", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckboxChecked });
    await nextTick();
    await nextTick();

    expect(wrapper.props("questions")[0].answer[1]).toBe("China");
    expect(wrapper.props("questions")[0].answer).toHaveLength(2);
  });

  test("Checkbox with object values", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckboxCheckedObjectValues });
    await nextTick();
    await nextTick();

    expect(wrapper.props("questions")[0].answer[0]).toStrictEqual({ country: "China", currency: "Yen" });
    expect(wrapper.props("questions")[0].answer).toHaveLength(1);
  });

  test("Checkbox with checked choice, but force default", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionCheckbox: QuestionCheckbox,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionCheckboxCheckedForceDefault });
    await nextTick();
    await nextTick();

    expect(wrapper.props("questions")[0].answer[0]).toBe("Germany");
    expect(wrapper.props("questions")[0].answer).toHaveLength(1);
  });
});
