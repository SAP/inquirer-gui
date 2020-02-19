import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

const questionConfirm = [
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure?",
    default: false
  }
];

describe('Question of type confirm', () => {
  test('Confirm', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionConfirm });
    await Vue.nextTick();

    const confirm = wrapper.find('label');
    confirm.trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });
});
