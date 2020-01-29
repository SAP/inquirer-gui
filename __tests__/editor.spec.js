import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

const filterSuffix = "!!!";
const questionEditor = [
  {
    type: "editor",
    name: "notes",
    message: function (answers) {
      return `Information about ${answers.name}`;
    },
    default: function (answers) {
      return `Information about ${answers.name}`;
    },
    filter: function (input) {
      return `${input}${filterSuffix}`;
    }
  }
];

describe('Question of type editor and filter func', () => {
  test('Editor', async () => {
    const value1 = "my lines";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionEditor });
    await Vue.nextTick();

    const notes = wrapper.find('textarea');
    notes.element.value = value1;
    notes.trigger('input');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].notes).toEqual(`${value1}${filterSuffix}`);
  });

});
