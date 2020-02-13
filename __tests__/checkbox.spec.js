import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';

const questionCheckbox = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China" },
      "Israel"
    ],
    default: ["Germany"]
  }
];

const questionCheckboxChoicesAsFunction = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: function (answers) {
      return [
        "USA",
        "Germany"
      ]
    }
  }
];

describe('Question of type checkbox', () => {
  test('Checkbox', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckbox });
    await Vue.nextTick();

    const citizenship = wrapper.find('input[role="checkbox"');
    citizenship.trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });

  test.only('Checkbox with choices as function', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckboxChoicesAsFunction });
    await Vue.nextTick();

    const citizenship = wrapper.find('input[role="checkbox"');
    citizenship.trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });
});
