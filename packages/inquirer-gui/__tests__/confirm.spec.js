/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";
import QuestionConfirm from "../src/packages/QuestionConfirm.vue";

const questionConfirm = [
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure?",
    labelTrue: "Accept",
    labelFalse: "Decline",
    default: false,
  },
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Question of type confirm", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("Confirm", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionConfirm: QuestionConfirm,
        },
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionConfirm });
    await nextTick();

    const confirm = wrapper.find("label");
    confirm.trigger("click");

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });
});
