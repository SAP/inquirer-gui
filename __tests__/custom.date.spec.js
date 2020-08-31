import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import QuestionDateTime from './QuestionDateTime.vue';

const questionDate = [
  {
    type: "date",
    name: "birthday",
    message: "birthday"
  }
];

describe('Question of custom type date', () => {
  test('Custom Date', async () => {
    Vue.component('QuestionDateTime', QuestionDateTime);
    await Vue.nextTick();
    const datePlugin = {
      questionType: "date",
      component: QuestionDateTime
    };

    const wrapper = mount(Form, {
      stubs: {
        'QuestionDateTime': QuestionDateTime
      }
    });
    wrapper.vm.registerPlugin(datePlugin);
    await Vue.nextTick();
    wrapper.setProps({ questions: questionDate });
    await Vue.nextTick();
    
    expect(wrapper.find('p.question-label > span.question-message').element.innerHTML).toBe("birthday");
  });

});
