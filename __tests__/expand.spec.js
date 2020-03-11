import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

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

describe('Question of type expand', () => {
  test('Expand', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionExpand });
    await Vue.nextTick();

    const expand = wrapper.find('div[role="listitem"]');
    expand.trigger('click');

    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].agree).toEqual(`Yes`);
  });

  test('Expand with default value (not index)', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionExpandDefaultValue });
    await Vue.nextTick();

    // test answers
    expect(wrapper.props("questions")[0].answer).toEqual("No");
  });

  test('Expand without default', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionExpandNoDefault });
    await Vue.nextTick();

    const expand = wrapper.findAll('div[role="listitem"');
    expand.at(1).trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].agree).toEqual("No");
  });

  test('Expand with separator', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionExpandWithSeparator });
    await Vue.nextTick();

    const divider = wrapper.find('hr[role="separator"');
    expect(divider).not.toBeUndefined();
  });

  test('Expand with empty choices', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionExpandEmptyChoices });
    await Vue.nextTick();
    await Vue.nextTick();
  
    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });
});
