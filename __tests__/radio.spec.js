import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

import RadioGroup from "../radio-button-plugin/src/packages/RadioGroup";


const questionRadio = [
  {
    type: "radio",
    name: "pat",
    message: "Your pat",
    choices: [
      "dog",
      "cat"
    ],
    default: ["cat"]
  }
];



describe('Question of type radio', () => {
  test('Radio', async () => {
    Vue.component('RadioGroup', RadioGroup);
    await Vue.nextTick();
    const radioPlugin = {
      questionType: "radio",
      component: RadioGroup
    };
  
    const wrapper = mount(Form, {});
    wrapper.vm.registerPlugin(radioPlugin);
    wrapper.setProps({ questions: questionRadio });
    await Vue.nextTick();
    
    const pat = wrapper.find('input[role="radio"]');//input[value="dog"]
    pat.trigger('click');

    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].pat).toContain("dog");
  });

  
});
