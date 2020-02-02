import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import QuestionDateTime from './QuestionDateTime.vue';

const questionDate = [
  {
    type: "date",
    name: "birthday"
  }
];

describe('Question of custom type date', () => {
  test('Custom Date', async () => {
    Vue.component('QuestionDateTime', QuestionDateTime);
    const datePlugin = {
      questionType: "date",
      component: QuestionDateTime
    };

    const wrapper = mount(Form, {
      stubs: {
        'QuestionDateTime': QuestionDateTime
      }
    });
    wrapper.setProps({ questions: questionDate });
    await Vue.nextTick();
    wrapper.vm.registerPlugin(datePlugin);
    await Vue.nextTick();
    
    expect(wrapper.find('div.question-date-container').exists()).toBe(true);
  });

});
