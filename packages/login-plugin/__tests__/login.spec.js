/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import QuestionLogin from "../src/packages/QuestionLogin.vue";

enableAutoUnmount(afterEach);

const mountLogin = (answer = "") =>
  mount(QuestionLogin, {
    props: { question: { name: "testUser", answer, type: "input" } },
    global: {
      stubs: {
        "vscode-textfield": { template: "<div><slot></slot></div>" },
        "v-tooltip": { template: "<div><slot name='activator' :props='{}'></slot></div>" },
        "v-icon": { template: "<i></i>" },
      },
    },
  });

describe("QuestionLogin", () => {
  test("onLogin emits answerChanged", () => {
    const wrapper = mountLogin("secret");
    wrapper.vm.onLogin();
    expect(wrapper.emitted("answerChanged")).toBeTruthy();
    expect(wrapper.emitted("answerChanged")[0]).toEqual(["testUser", "secret"]);
  });

  test("onInput updates question.answer", () => {
    const wrapper = mountLogin("");
    wrapper.vm.onInput({ target: { value: "newpass" } });
    expect(wrapper.props().question.answer).toBe("newpass");
  });

  test("onLoginReal emits customEvent with doLogin", () => {
    const wrapper = mountLogin("secret");
    wrapper.vm.onLoginReal();
    expect(wrapper.emitted("customEvent")).toBeTruthy();
    const args = wrapper.emitted("customEvent")[0];
    expect(args[0]).toBe("testUser");
    expect(args[1]).toBe("doLogin");
    expect(typeof args[2]).toBe("function");
    expect(args[3]).toBe("secret");
  });

  test("afterLogin is a no-op", () => {
    const wrapper = mountLogin();
    expect(() => wrapper.vm.afterLogin()).not.toThrow();
  });
});

describe("mountLineHeightPatch in QuestionLogin", () => {
  test("injects exactly one style.line-height-patch and is idempotent", () => {
    const styleNodes = [];
    const mockShadowRoot = {
      querySelector: () => styleNodes.find((n) => n.className === "line-height-patch") || null,
      appendChild: (node) => styleNodes.push(node),
    };
    const wrapper = mount(QuestionLogin, {
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
    const wrapper = mount(QuestionLogin, {
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
