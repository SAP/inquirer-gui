/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import QuestionEditor from "../src/packages/QuestionEditor.vue";
import utils from "./utils";

const filterSuffix = "!!!";
const questionEditor = [
  {
    type: "editor",
    name: "notes",
    message: function (answers) {
      return `Information about ${answers.name}`;
    },
    default: function (answers) {
      return `Information about ${answers.name}`;
    },
    filter: function (input) {
      return `${input}${filterSuffix}`;
    },
  },
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Question of type editor and filter func", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("Editor", async () => {
    const value1 = "my lines";

    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionEditor: QuestionEditor,
        },
        stubs: {
          VscodeTextarea: {
            template: "<textarea></textarea>",
          },
          VscodeTextfield: {
            template: "<div></div>",
          },
        },
      },
      attachTo: document.body,
    });
    // Provide answers with a name property
    const answers = { name: "testName" };
    const updatedQuestions = questionEditor.map((question) => ({
      ...question,
      message: question.message(answers),
      default: question.default(answers),
      filter: question.filter,
    }));

    wrapper.setProps({ questions: updatedQuestions });
    await nextTick();

    const notes = wrapper.find("textarea");
    notes.element.value = value1;
    notes.trigger("change");

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].notes).toEqual(`${value1}${filterSuffix}`);
  });
});
