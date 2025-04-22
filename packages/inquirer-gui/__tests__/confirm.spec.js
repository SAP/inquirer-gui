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
    default: false,
  },
];

const questionConfirmWithOneLabel = [
  {
    type: "confirm",
    name: "confirm",
    message: "Do you agree?",
    labelTrue: "Accept",
    default: false,
  },
];

const questionConfirmWithTwoLabels = [
  {
    type: "confirm",
    name: "confirm",
    message: "Do you agree?",
    labelTrue: "Accept",
    labelFalse: "Decline",
    default: false,
  },
];

const vscodeStubs = {
  VscodeRadioGroup: {
    template: "<div><slot></slot></div>",
  },
  VscodeRadio: {
    props: ["label", "value"],
    template: `
        <div>
          <input
            type="radio"
            :value="value"
            :id="label"
            name="radio-group"
            @change="emitChange"
          />
          <label :for="label">{{ label }}</label>
        </div>
      `,
    methods: {
      emitChange() {
        this.$emit("change", { target: { value: this.value } });
      },
    },
  },
};

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
        stubs: vscodeStubs,
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

  test("Confirm renders default labels", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionConfirm: QuestionConfirm,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionConfirm });
    await nextTick();

    const labels = wrapper.findAll("label");

    expect(labels.at(0).text()).toBe("Yes");
    expect(labels.at(1).text()).toBe("No");

    labels.at(0).trigger("click");

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });

  test("Confirm renders only one overridden label", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionConfirm: QuestionConfirm,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionConfirmWithOneLabel });
    await nextTick();

    const labels = wrapper.findAll("label");

    expect(labels.at(0).text()).toBe("Accept");
    expect(labels.at(1).text()).toBe("No");

    labels.at(0).trigger("click");

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });

  test("Confirm renders two overridden labels", async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          QuestionConfirm: QuestionConfirm,
        },
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    wrapper.setProps({ questions: questionConfirmWithTwoLabels });
    await nextTick();

    const labels = wrapper.findAll("label");

    expect(labels.at(0).text()).toBe("Accept");
    expect(labels.at(1).text()).toBe("Decline");

    labels.at(0).trigger("click");

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength - 1];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });
});
