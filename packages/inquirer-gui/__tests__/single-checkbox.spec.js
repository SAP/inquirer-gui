/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../src/Form.vue";

import SingleCheckBoxPlugin from "../../single-checkbox-plugin/src";
// import SingleCheckBoxPlugin from "@sap-devx/inquirer-gui-single-checkbox-plugin";

const questionSingleCheckbox = [
  {
    type: "single-checkbox",
    hint: "hint test",
    name: "test",
    title: "Check this option to test",
    message: "Your check",
    default: false,
  },
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Question of type single checkbox", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("single checkbox", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [SingleCheckBoxPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionSingleCheckbox });
    await nextTick();

    const pat = wrapper.find('input[id="test_input"]');
    pat.trigger("click");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    expect(wrapper.props("questions")[0].answer).toBeTruthy();
  });
});
