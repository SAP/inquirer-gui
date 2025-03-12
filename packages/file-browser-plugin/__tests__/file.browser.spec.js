/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../../inquirer-gui/src/Form.vue";

import QuestionFileBrowserPlugin from "../../file-browser-plugin/src";
// import QuestionFileBrowserPlugin from "@sap-devx/inquirer-gui-file-browser-plugin";

const questionFileBrowser = [
  {
    type: "file-browser",
    name: "configFile",
    message: "Config file",
    default: "/home/",
    getFilePath: async function (currentPath) {
      return `${currentPath}user`;
    },
  },
];
enableAutoUnmount(afterEach); // Ensures wrapper component gets cleaned up after each test

describe("Question of type file browser", () => {
  let vuetify;

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });
  });

  test("File Browser", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionFileBrowserPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionFileBrowser });

    await nextTick();
    const icon = wrapper.findComponent({ name: "v-icon" });
    icon.trigger("click");

    await nextTick();

    expect(wrapper.props().questions[0].answer).toBe("/home/user");
  });

  test("File Browser input field", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionFileBrowserPlugin, options]],
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionFileBrowser });

    await nextTick();
    const input = wrapper.find("input");
    input.setValue("/home/user");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedEvent = wrapper.emitted().answered;
    const emittedPayload = emittedEvent[emittedEvent.length - 1];
    expect(emittedPayload[0].configFile).toEqual("/home/user");
    expect(emittedPayload[1]).toBeUndefined();
  });
});
