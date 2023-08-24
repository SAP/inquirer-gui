/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import QuestionList from "../src/packages/QuestionList.vue";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const questionList = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", { name: "China" }, "Israel"],
    default: "China",
  },
];

const questionListNoDefault = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
  },
];

const questionListWithHint = [
  {
    type: "list",
    name: "country_0",
    message: "The country where you live 0",
    guiOptions: {
      hint: "hint for list 0",
    },
    choices: ["USA", "Germany", { name: "China" }, "Israel"],
  },
  {
    type: "list",
    name: "country_1",
    message: "The country where you live 1",
    guiOptions: {
      hint: "hint for list 1",
    },
    choices: ["USA", "Germany", { name: "China" }, "Israel"],
    default: "China",
  },
  {
    type: "list",
    name: "country_2",
    message: "The country where you live 2",
    choices: ["USA", "Germany", { name: "China" }, "Israel"],
  },
];

const Inquirer_Default_Separator = {
  type: "separator",
  line: "\u001b[2m──────────────\u001b[22m",
};
const Inquirer_Sample_Separator = {
  type: "separator",
  line: "\u001b[2mCustom Separator\u001b[22m",
};
const questionListWithSeparator = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: [
      "USA",
      Inquirer_Default_Separator,
      "Germany",
      Inquirer_Sample_Separator,
      "China",
      "Israel",
    ],
  },
];

const questionListInvalidChoices = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: "USA",
  },
];

const questionListDefaultAsIndex = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
    default: 1,
  },
];

const questionListDefaultAsInvalidIndex = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
    default: 10,
  },
];

const questionListEmptyChoices = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: [],
  },
];

const questionListValidate = [
  {
    type: "list",
    name: "list1",
    message: "message for list1",
    choices: ["item11", "item12", "item13"],
    default: "item12",
  },
  {
    type: "list",
    name: "list2",
    message: "message for list2",
    when: (answers) => {
      return !!answers.list1;
    },
    choices: ["item21", "item22", "item23"],
    validate: (input) => (input ? true : "select list2 item"),
  },
  {
    type: "list",
    name: "list3",
    message: "message for list3",
    when: (answers) => {
      return !!answers.list2;
    },
    choices: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(["item31", "item32", "item33"]);
        }, 300);
      });
    },
    validate: (input) => (input ? true : "select list3 item"),
  },
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Question of type list", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });
  test("List", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionList });

    await nextTick();

    expect(wrapper.vm.$props.questions[0].answer).toBe(questionList[0].default);
  });

  test("List without default", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListNoDefault });

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();

    // test validation text
    const errors = wrapper.findAll("span.error-validation-text");
    expect(errors.at(0).element.innerHTML).toBe("Mandatory field");
  });

  test("List with separator", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({
      questions: questionListWithSeparator,
    });
    await nextTick();

    const menu = wrapper.findComponent({ name: "v-icon" });
    menu.trigger("mousedown");

    await nextTick();

    const list = document.body.querySelector(".v-list");
    expect(list.querySelectorAll(".v-list-item")).toHaveLength(6);
    expect(list.querySelectorAll(".v-divider")).toHaveLength(1);
    expect(list.querySelectorAll(".v-list-subheader")).toHaveLength(1);

    const subheader = list.querySelectorAll(".v-list-subheader")[0];
    expect(subheader.textContent).toBe("Custom Separator");
  });

  test("List with invalid choices", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListInvalidChoices });

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });

  test("List with default as index", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListDefaultAsIndex });

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBe("Germany");
  });

  test("List with default as invalid index", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListDefaultAsInvalidIndex });

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBe(undefined);
  });

  test("List with empty choices", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListEmptyChoices });

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });

  test("List with hint", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListWithHint });
    await nextTick();

    const labels = wrapper.findAll("p.question-label");

    expect(
      labels.at(0).findAll("span.question-message").at(0).element.innerHTML,
    ).toBe(questionListWithHint[0].message);
    expect(
      labels.at(0).findAll("span.question-hint").at(0).element.innerHTML,
    ).toContain("v-tooltip");

    expect(
      labels.at(1).findAll("span.question-message").at(0).element.innerHTML,
    ).toBe(questionListWithHint[1].message);
    expect(
      labels.at(1).findAll("span.question-hint").at(0).element.innerHTML,
    ).toContain("v-tooltip");

    expect(
      labels.at(2).findAll("span.question-message").at(0).element.innerHTML,
    ).toBe(questionListWithHint[2].message);
    expect(labels.at(2).findAll("span.question-hint").length).toBe(0);
  });

  test("list with validate", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionList: QuestionList,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionListValidate });
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();

    // should get 2 * and validation error message from list2
    let errorValidationText = wrapper.findAll("span.error-validation-text");
    expect(errorValidationText.length).toEqual(1);
    let mandatoryAsterisk = wrapper.findAll("span.mandatory-asterisk");
    expect(mandatoryAsterisk.length).toEqual(2);
    expect(errorValidationText.at(0).element.innerHTML).toBe(
      questionListValidate[1].validate(),
    );

    // answer on list2 question
    await wrapper.vm.onAnswerChanged("list2", "item22");
    await nextTick();

    // should get 3 * and validation error message from list3
    errorValidationText = wrapper.findAll("span.error-validation-text");
    expect(errorValidationText.length).toEqual(1);
    mandatoryAsterisk = wrapper.findAll("span.mandatory-asterisk");
    expect(mandatoryAsterisk.length).toEqual(3);
    expect(errorValidationText.at(0).element.innerHTML).toBe(
      questionListValidate[2].validate(),
    );

    // answer on list2 question
    await wrapper.vm.onAnswerChanged("list3", "item23");
    await nextTick();

    // should get 3 * and no validation error messages
    errorValidationText = wrapper.findAll("span.error-validation-text");
    expect(errorValidationText.length).toEqual(0);
    mandatoryAsterisk = wrapper.findAll("span.mandatory-asterisk");
    expect(mandatoryAsterisk.length).toEqual(3);
  });
});
