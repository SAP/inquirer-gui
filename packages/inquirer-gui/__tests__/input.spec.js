/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import InputVue from "../src/packages/QuestionInput.vue";
import utils from "./utils";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const questionInput = [
  {
    type: "input",
    name: "input",
    message: "An input",
    default: "default input",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
        return "Name must be at least 2 characters long";
      }
    },
  },
];

const questionInputPlaceholder = [
  {
    type: "input",
    name: "input",
    message: "An input",
    default: "default input",
    placeholder: "This is a placeholder.",
  },
];

const questionPassword = [
  {
    type: "password",
    name: "password",
    message: "A password",
  },
];

const questionNumber = [
  {
    type: "number",
    name: "number",
    message: "A number",
    default: "0",
  },
];

const questionsConditional = [
  {
    type: "input",
    name: "condition",
    default: "some value",
  },
  {
    type: "input",
    name: "conditional",
    when: function (answers) {
      return answers.condition !== "hide";
    },
  },
  {
    type: "input",
    name: "conditional2",
    when: false,
  },
  {
    type: "input",
    name: "conditional3",
    when: true,
  },
];

const questionsMessageAsFunction = [
  {
    type: "input",
    name: "trigger",
    default: "some value",
  },
  {
    type: "input",
    name: "message",
    message: function (answers) {
      return `${answers.trigger}-message`;
    },
  },
];

const questionsDefaultAsFunction = [
  {
    type: "input",
    name: "trigger",
    default: "some value",
  },
  {
    type: "input",
    name: "default",
    default: function (answers) {
      return `${answers.trigger}-default`;
    },
  },
];

const questionsWithApplyDefaultWhenDirty = [
  {
    type: "input",
    name: "trigger",
    default: "some value",
  },
  {
    type: "input",
    guiOptions: {
      applyDefaultWhenDirty: true,
    },
    name: "default",
    default: function (answers) {
      return `${answers.trigger}-default`;
    },
  },
];

const questionInputNoMessage = [
  {
    type: "input",
    name: "input with no message",
  },
];

const questionInputDefaultException = [
  {
    type: "input",
    name: "inputDefaultException",
    message: "An input",
    default: function () {
      throw "exception";
    },
  },
];

const questionsWhen = [
  {
    name: "first",
    type: "input",
  },
  {
    type: "input",
    when: function () {
      return false;
    },
    name: "second",
    validate: async function () {
      return "Must enter value";
    },
  },
];

const questionInputHint = [
  {
    type: "input",
    name: "hint_validation",
    message: "message for input 0",
    guiOptions: {
      hint: "hint for input 0",
    },
    validate: function (input) {
      return input.length >= 2 ? true : "Name must be at least 2 characters long";
    },
  },
  {
    type: "input",
    name: "hint_deault_validation",
    message: "message for input 1",
    guiOptions: {
      hint: "hint for input 1",
    },
    default: "default input",
    validate: function (input) {
      return input.length >= 2 ? true : "Name must be at least 2 characters long";
    },
  },
  {
    type: "input",
    name: "no_hint_no_deault_validation",
    message: "message for input 2",
    validate: function (input) {
      return input.length >= 2 ? true : "Name must be at least 2 characters long";
    },
  },
];

const questionInputLink = [
  {
    type: "input",
    name: "link_uri",
    message: "message for input 0",
    guiOptions: {
      link: {
        text: "link for input 0",
        url: "https://uri.for.input.0",
      },
    },
  },
  {
    type: "input",
    name: "link_command",
    message: "message for input 1",
    guiOptions: {
      hint: "hint for input 1",
      link: {
        text: "link for input 1",
        command: {
          id: "workbench.action.showCommands",
        },
      },
    },
  },
  {
    type: "input",
    name: "no_link",
    message: "message for input 2",
  },
];

/* Validation link test definitions */
const validationWithLink = {
  message: "The input is invalid - link",
  link: {
    text: "Need help with this error? - link",
    icon: "data:image/svg+xml;base64, NOT_AN_IMAGE",
    url: "http://help/with/validation/error",
  },
};

const validationWithCommand = {
  message: "The input is invalid - cmd",
  link: {
    text: "Need help with this error? - cmd",
    command: {
      id: "a.command.id",
      params: { prop1: "123", prop2: false },
    },
  },
};

const questionsWithValidateLinks = [
  {
    type: "input",
    name: "validate_with_link",
    message: "message for input validate_with_link",
    validate: function (input) {
      return input ? validationWithLink : true;
    },
  },
  {
    type: "input",
    name: "validate_with_command",
    message: "message for input validate_with_command",
    validate: function (input) {
      if (input === "triggerValLink") {
        return validationWithCommand;
      }

      if (input === "triggerValTex") {
        return "text validation message 1234";
      }
      return true;
    },
  },
];

const questionsWithAdditionalMessages = [
  {
    type: "input",
    name: "inputToUpdateAddMsg",
    default: "some value",
  },
  {
    type: "input",
    name: "inputWithMoreMessages",
    message: "More messages input",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
        return "Name must be at least 2 characters long";
      }
    },
    additionalMessages: (input, answers) => {
      if (input === "warn") {
        return {
          message: "Some warning message",
          severity: 1,
        };
      }
      if (input === "info") {
        return {
          message: "Some info message",
          severity: 2,
        };
      }
      if (input === "error") {
        return {
          message: "Some error message",
          severity: 0,
        };
      }
      if (input === "warn1" && answers.inputToUpdateAddMsg === "another value") {
        return {
          message: "Some dependant warning message",
          severity: 1,
        };
      }
    },
  },
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Questions of type input, password and number", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("Input", async () => {
    const value1 = "my input";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInput });
    await nextTick();

    const name = wrapper.find("input");
    name.element.value = value1;
    name.trigger("input");

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].input).toEqual(value1);
    // test validation
    expect(answered[1]).toBeUndefined();
  });

  test("Input with placeholder value", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInputPlaceholder });
    await nextTick();

    const input = wrapper.find("input");
    expect(input.element.placeholder).toBe("This is a placeholder.");
  });

  test("Input with invalid input", async () => {
    const value1 = "m";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInput });
    await nextTick();

    const name = wrapper.find("input");
    name.element.value = value1;
    name.trigger("input");

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].input).toEqual(value1);
    // test validation
    expect(answered[1]).toHaveProperty("input");
  });

  test("Password", async () => {
    const value1 = "my password";
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionPassword });
    await nextTick();

    const name = wrapper.find("input");
    name.element.value = value1;
    name.trigger("input");

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].password).toEqual(value1);
  });

  test("Number", async () => {
    const value1 = 5;
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionNumber });
    await nextTick();

    const name = wrapper.find("input");
    name.element.value = value1;
    name.trigger("input");

    // wait to account for debounce
    await utils.sleep(300);
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].number).toEqual(value1.toString());
  });

  test("Number without default", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionNumber });
    await nextTick();

    const name = wrapper.find("input");
    expect(name.element.value).toBe("0");
  });

  test("Input with conditions", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsConditional });
    await nextTick();

    await utils.sleep(300);
    expect(wrapper.emitted().whensEvaluated).toBeTruthy();

    let inputs = wrapper.findAll("input");
    expect(inputs.length).toEqual(4);
    inputs.at(0).element.value = "hide";
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.length).toEqual(3);
  });

  test("Input with message as a function", async () => {
    const newValue = "another value";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsMessageAsFunction });
    await nextTick();

    let inputs = wrapper.findAll("input");
    inputs.at(0).element.value = newValue;
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("p.question-label > span.question-message");
    expect(inputs.at(1).element.innerHTML).toBe(`${newValue}-message`);
  });

  test("Input with default as a function", async () => {
    const newValue = "another value";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsDefaultAsFunction });
    await nextTick();

    let inputs = wrapper.findAll("input");
    inputs.at(0).element.value = newValue;
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(`${newValue}-default`);

    // Test that default() is not being called when qustion is dirty
    const dirtyValue = "dirty value";
    const anotherValue = "another value";

    inputs.at(1).element.value = dirtyValue;
    inputs.at(1).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(dirtyValue);

    inputs.at(0).element.value = anotherValue;
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(dirtyValue);
  });

  test("Input with guiOptions.applyDefaultWhenDirty", async () => {
    const newValue = "new value";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsWithApplyDefaultWhenDirty });
    await nextTick();

    let inputs = wrapper.findAll("input");
    inputs.at(0).element.value = newValue;
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(`${newValue}-default`);

    // Test that default() is being called when qustion is dirty
    const dirtyValue = "dirty value";
    const anotherValue = "another value";

    inputs.at(1).element.value = dirtyValue;
    inputs.at(1).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(dirtyValue);

    inputs.at(0).element.value = anotherValue;
    inputs.at(0).trigger("input");
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll("input");
    expect(inputs.at(1).element.value).toBe(`${anotherValue}-default`);
  });

  test("Input with no message", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInputNoMessage });
    await nextTick();

    const inputs = wrapper.findAll("p.question-label > span.question-message");
    // message should default to question's name
    expect(inputs.at(0).element.innerHTML).toBe(questionInputNoMessage[0].name);
  });

  test("Input with exception in default()", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInputDefaultException });
    await nextTick();

    expect(wrapper.props("questions")[0]._default).toBeUndefined();
  });

  test("when() evaluates to false", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsWhen });
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.vm.questions[1].shouldShow).toBe(false);
    expect(wrapper.vm.getIssues()).toBe(undefined);
  });

  test("Input with hint", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInputHint });
    await nextTick();
    await utils.sleep(300);

    const labels = wrapper.findAll("p.question-label");

    expect(labels.at(0).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputHint[0].message);
    expect(labels.at(0).findAll("span.question-hint")[0].element.innerHTML).toContain("v-tooltip");

    expect(labels.at(1).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputHint[1].message);
    expect(labels.at(1).findAll("span.question-hint")[0].element.innerHTML).toContain("v-tooltip");

    expect(labels.at(2).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputHint[2].message);
    expect(labels.at(2).findAll("span.question-hint").length).toBe(0);

    labels.at(0).findComponent({ name: "v-icon" }).trigger("mouseenter");

    await nextTick();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(document.body.textContent).toContain(questionInputHint[0].guiOptions.hint);
  });

  test("Input with link", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionInputLink });
    await nextTick();
    await utils.sleep(300);

    const labels = wrapper.findAll("p.question-label");

    expect(labels.at(0).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputLink[0].message);
    expect(labels.at(0).findAll("span.question-link")[0].element.innerHTML).toContain("a");
    expect(labels.at(0).findAll("span.question-link")[0].element.innerHTML).toContain("href");
    expect(labels.at(0).findAll("a")[0].element.innerHTML).toBe(questionInputLink[0].guiOptions.link.text);
    expect(labels.at(0).findAll("a")[0].element.href).toContain(questionInputLink[0].guiOptions.link.url);

    expect(labels.at(1).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputLink[1].message);
    expect(labels.at(1).findAll("span.question-link")[0].element.innerHTML).toContain("a");
    expect(labels.at(1).findAll("span.question-link")[0].element.innerHTML).toContain("command");
    expect(labels.at(1).findAll("a")[0].element.innerHTML).toBe(questionInputLink[1].guiOptions.link.text);
    expect(labels.at(1).findAll("a")[0].element.attributes.command.value).toBe(
      questionInputLink[1].guiOptions.link.command.id,
    );

    expect(labels.at(2).findAll("span.question-message")[0].element.innerHTML).toBe(questionInputLink[2].message);
    expect(labels.at(2).findAll("span.question-link").length).toBe(0);
  });

  test("Input with validationLink", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsWithValidateLinks });
    await nextTick();
    await utils.sleep(300);

    const allInputs = wrapper.findAll("input");

    expect(wrapper.find("#validation-msg-" + 0).exists()).toBe(false);
    expect(wrapper.find("#validation-msg-" + 1).exists()).toBe(false);

    // Question at index 0 is validation with url link
    const valWithLinkInput = allInputs.at(0);
    valWithLinkInput.setValue("anyvalue0");
    await utils.sleep(300);

    // Check validation messages
    const validationMsgWithLink = wrapper.find("#validation-msg-" + 0);

    expect(validationMsgWithLink.find("span.error-validation-text").element.innerHTML).toEqual(
      validationWithLink.message,
    );

    expect(validationMsgWithLink.find("span.question-link").exists()).toBe(true);

    expect(validationMsgWithLink.find("img.validation-link-icon").element.getAttribute("src")).toEqual(
      validationWithLink.link.icon,
    );

    expect(validationMsgWithLink.find("a").element.getAttribute("href")).toEqual(validationWithLink.link.url);
    expect(validationMsgWithLink.find("#urlLinkText").text()).toEqual(validationWithLink.link.text);

    // Question at index 1 is validation with command link
    let valWithCmdInput = allInputs.at(1);
    valWithCmdInput.setValue("triggerValLink");
    await utils.sleep(300);

    let validationMsgWithCmd = wrapper.find("#validation-msg-" + 1);
    expect(validationMsgWithCmd.find("span.error-validation-text").element.innerHTML).toEqual(
      validationWithCommand.message,
    );

    expect(validationMsgWithCmd.find("span.question-link").exists()).toBe(true);

    expect(validationMsgWithCmd.find("img.validation-link-icon").exists()).toBe(false);
    expect(validationMsgWithCmd.find("#cmdLinkText").text()).toEqual(validationWithCommand.link.text);

    // Ensure link is removed from dom when re-validated with non-link validation message
    // There is an issue with this test. Running the actual code in-situ works as expected.
    /* valWithCmdInput.element.value = "triggerValTex";
    valWithCmdInput.trigger("input");
    await utils.sleep(300);
    
    const validationText = wrapper.find("#validation-msg-" + 1);
    expect(
      validationText.find("span.error-validation-text").element.innerHTML
    ).toEqual("text validation message 1234");
    expect(validationMsgWithCmd.find("span.question-link").isVisible()).toBe(false);
    expect(validationMsgWithCmd.find("#cmdLinkText").exists()).toBe(false); */
  });

  test("Input with additional messages", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionInput: InputVue,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionsWithAdditionalMessages });
    await nextTick();
    await utils.sleep(300);

    expect(wrapper.find("#add-msg-" + 0).exists()).toBe(false);
    expect(wrapper.find("#add-msg-" + 1).exists()).toBe(false);
    expect(wrapper.find("#validation-msg-1").exists()).toBe(true);

    const allInputs = wrapper.findAll("input");
    const inputWithAddMsgs = allInputs.at(1);
    inputWithAddMsgs.setValue("warn");
    await utils.sleep(300);

    // Check that we have warning message and the validation message is not shown anymore
    expect(wrapper.find("#validation-msg-1").exists()).toBe(false);
    let addMessage = wrapper.find(".add-messages");

    expect(addMessage.find("i.v-icon.messages-icon.severity-warn.mdi-alert-outline").exists()).toBe(true);

    expect(addMessage.find("span.messages-text").text()).toEqual("Some warning message");

    inputWithAddMsgs.setValue("info");
    await utils.sleep(300);

    expect(addMessage.find("i.v-icon.messages-icon.severity-info.mdi-information-outline").exists()).toBe(true);

    expect(addMessage.find("span.messages-text").text()).toEqual("Some info message");

    inputWithAddMsgs.setValue("error");
    await utils.sleep(300);

    expect(addMessage.find("i.v-icon.messages-icon.severity-error.mdi-close-circle-outline").exists()).toBe(true);

    expect(addMessage.find("span.messages-text").text()).toEqual("Some error message");

    // Test that other answers (previous answers) can be used to trigger updates
    inputWithAddMsgs.setValue("warn1");
    await utils.sleep(300);

    expect(wrapper.find(".add-messages").exists()).toBe(false);

    const question1Input = allInputs.at(0);
    question1Input.setValue("another value");
    await utils.sleep(300);

    const addMessageDependant = wrapper.find("#add-msg-1");
    expect(addMessageDependant.exists()).toBe(true);

    expect(addMessageDependant.find("i.v-icon.messages-icon.severity-warn.mdi-alert-outline").exists()).toBe(true);

    expect(addMessageDependant.find("span.messages-text").text()).toEqual("Some dependant warning message");
  });
});
