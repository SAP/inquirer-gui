import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components/index.mjs';
import FormVue from "../src/Form.vue";
import QuestionExpand from '../src/packages/QuestionExpand.vue';

const questionExpand = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"],
    default: 0
  }
];

const questionExpandDefaultValue = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"],
    default: "No"
  }
];

const questionExpandNoDefault = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"]
  }
];

const questionExpandEmptyChoices = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: []
  }
];

const questionExpandWithSeparator = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", { type: "separator" }, "Maybe"]
  }
];
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe('Question of type expand', () => {

  let vuetify

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components
    });
  })
  test('Expand', async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          'QuestionExpand': QuestionExpand
        }
      },
      attachTo: document.body
    });
    wrapper.setProps({ questions: questionExpand });
    await nextTick();

    const expand = wrapper.findComponent({name: 'v-list-item'});
    expand.trigger('click');

    await nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].agree).toEqual(`Yes`);
  });

  test('Expand with default value (not index)', async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          'QuestionExpand': QuestionExpand
        }
      },
      attachTo: document.body
    });
    wrapper.setProps({ questions: questionExpandDefaultValue });
    await nextTick();

    // test answers
    expect(wrapper.props("questions")[0].answer).toEqual("No");
  });

  test('Expand without default', async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          'QuestionExpand': QuestionExpand
        }
      },
      attachTo: document.body
    });
    wrapper.setProps({ questions: questionExpandNoDefault });
    await nextTick();

    const expand = wrapper.findAllComponents({name: 'v-list-item'});
    expand.at(1).trigger('click');

    await nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].agree).toEqual("No");
  });

  test('Expand with separator', async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          'QuestionExpand': QuestionExpand
        }
      },
      attachTo: document.body
    });
    wrapper.setProps({ questions: questionExpandWithSeparator });
    await nextTick();

    const divider = wrapper.find('hr[role="separator"]');
    expect(divider).not.toBeUndefined();
  });

  test('Expand with empty choices', async () => {
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify],
        components: {
          'QuestionExpand': QuestionExpand
        }
      },
      attachTo: document.body
    });
    wrapper.setProps({ questions: questionExpandEmptyChoices });
    await nextTick();
    await nextTick();
  
    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });
});
