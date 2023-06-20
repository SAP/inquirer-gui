import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

import SingleCheckbox from "../single-checkbox-plugin/src/packages/SingleCheckbox";


const questionSingleCheckbox = [
  {
    type: "single-checkbox",
    hint: "hint test",
    name: "test",
    title: "Check this option to test",
    message: "Your check",
    default: false
  }
];



describe('Question of type single checkbox', () => {
  test('single checkbox', async () => {
    Vue.component('SingleCheckbox', SingleCheckbox);
    await Vue.nextTick();
    const singleCheckboxPlugin = {
      questionType: "single-checkbox",
      component: SingleCheckbox
    };
  
    const wrapper = mount(Form, {});
    wrapper.vm.registerPlugin(singleCheckboxPlugin);
    wrapper.setProps({ questions: questionSingleCheckbox });
    await Vue.nextTick();
    
    const pat = wrapper.find('input[id="test_input"]');
    pat.trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    expect(wrapper.props("questions")[0].answer).toBeTruthy();
  });

  
});
