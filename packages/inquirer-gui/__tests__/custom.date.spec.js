/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";
import FormVue from "../src/Form.vue";

import QuestionDateTimePlugin from "../../../examples/sample-plugin/src";
// import QuestionDateTimePlugin from "@sap-devx/inquirer-gui-date-plugin";

const questionDate = [
  {
    type: "date",
    name: "birthday",
    message: "birthday",
  },
];

enableAutoUnmount(afterEach);

describe("Question of custom type date", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components: {
        ...components,
        ...labsComponents,
      },
    });
  });
  test("Custom Date", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionDateTimePlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);

    await nextTick();
    wrapper.setProps({ questions: questionDate });
    await nextTick();

    expect(
      wrapper.find("p.question-label > span.question-message").element
        .innerHTML,
    ).toBe("birthday");
  });
});
