/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components/index.mjs";
import FormVue from "../../inquirer-gui/src/Form.vue";
import QuestionFileBrowser from "../src/packages/QuestionFileBrowser.vue";

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

const vscodeStubs = {
  "vscode-textfield": {
    template: `
      <div>
        <input
          type="text"
          :value="value"
          @input="$emit('update:value', $event.target.value)"
          @change="$emit('change', $event)"
        />
        <slot></slot>
      </div>
    `,
    props: ["value"],
  },
  "v-icon": {
    template: "<i></i>",
  },
};

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
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionFileBrowser });

    await nextTick();
    const icon = wrapper.find("i");
    icon.trigger("click");

    await nextTick();

    expect(wrapper.props().questions[0].answer).toBe("/home/user");
  });

  test("File Browser input field", async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionFileBrowserPlugin, options]],
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionFileBrowser });

    await nextTick();
    const input = wrapper.find("input");
    input.setValue("/home/user");
    input.trigger("change");

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedEvent = wrapper.emitted().answered;
    const emittedPayload = emittedEvent[emittedEvent.length - 1];
    expect(emittedPayload[0].configFile).toEqual("/home/user");
    expect(emittedPayload[1]).toBeUndefined();
  });
});

describe("mountLineHeightPatch in QuestionFileBrowser", () => {
  test("injects exactly one style.line-height-patch and is idempotent", () => {
    const styleNodes = [];
    const mockShadowRoot = {
      querySelector: () => styleNodes.find((n) => n.className === "line-height-patch") || null,
      appendChild: (node) => styleNodes.push(node),
    };
    const wrapper = mount(QuestionFileBrowser, {
      props: { question: { name: "test", answer: "", type: "input" } },
      global: {
        stubs: {
          "vscode-textfield": { template: "<div><slot></slot></div>" },
          "v-tooltip": { template: "<div><slot name='activator' :props='{}'></slot></div>" },
          "v-icon": { template: "<i></i>" },
        },
      },
    });
    Object.defineProperty(wrapper.vm.$refs.textfield, "shadowRoot", { value: mockShadowRoot, writable: true });
    Object.defineProperty(wrapper.vm.$refs.textfield, "updateComplete", { value: undefined, writable: true });
    wrapper.vm.$options.mounted.call(wrapper.vm);
    wrapper.vm.$options.mounted.call(wrapper.vm);
    expect(styleNodes.length).toBe(1);
    expect(styleNodes[0].className).toBe("line-height-patch");
    expect(styleNodes[0].textContent).toContain("line-height: normal");
  });

  test("injects patch after updateComplete resolves", async () => {
    const styleNodes = [];
    const mockShadowRoot = {
      querySelector: () => styleNodes.find((n) => n.className === "line-height-patch") || null,
      appendChild: (node) => styleNodes.push(node),
    };
    const wrapper = mount(QuestionFileBrowser, {
      props: { question: { name: "test", answer: "", type: "input" } },
      global: {
        stubs: {
          "vscode-textfield": { template: "<div><slot></slot></div>" },
          "v-tooltip": { template: "<div><slot name='activator' :props='{}'></slot></div>" },
          "v-icon": { template: "<i></i>" },
        },
      },
    });
    Object.defineProperty(wrapper.vm.$refs.textfield, "shadowRoot", { value: mockShadowRoot, writable: true });
    Object.defineProperty(wrapper.vm.$refs.textfield, "updateComplete", { value: Promise.resolve(), writable: true });
    wrapper.vm.$options.mounted.call(wrapper.vm);
    await Promise.resolve();
    expect(styleNodes.length).toBe(1);
    expect(styleNodes[0].className).toBe("line-height-patch");
  });
});
