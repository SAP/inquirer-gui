import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import utils from './utils';

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
    choices: function () {
      return [
        "USA",
        "Germany"
      ]
    },
    default: ["Germany"]
  }
];

const questionCheckboxDynamicChoicesAsFunction = [
  {
    type: "input",
    name: "country"
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: function (answers) {
      const response = ["USA", "Germany"];
      if (answers.country) {
        response.push(answers.country);
      }
      return response;
    },
    default: ["Germany"]
  }
];

const questionCheckboxChecked = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China", checked: true },
      "Israel"
    ],
    default: ["Germany", "China"]
  }
];

const questionCheckboxCheckedForceDefault = [
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China", checked: true },
      "Israel"
    ],
    default: ["Germany"],
    __ForceDefault: true
  }
];

describe('Question of type checkbox', () => {
  test('Checkbox', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckbox });
    await Vue.nextTick();

    const citizenship = wrapper.findComponent('div[role="listitem"]');
    citizenship.trigger('click');

    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });

  test('Checkbox with choices as function', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckboxChoicesAsFunction });
    await Vue.nextTick();

    const citizenship = wrapper.findComponent('div[role="listitem"]');
    citizenship.trigger('click');

    await Vue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });

  test('Checkbox with choices as function that return dynamic values', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckboxDynamicChoicesAsFunction });
    await Vue.nextTick();

    const name = wrapper.findComponent('input');
    const country = "A country";
    name.element.value = country;
    name.trigger('input');

    // wait to account for debounce
    await utils.sleep(300);

    await Vue.nextTick();
    expect(wrapper.props("questions")[1]._choices[2].value).toBe(country);
  });

  test('Checkbox with checked choice', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckboxChecked });
    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.props("questions")[0].answer[1]).toBe("China");
    expect(wrapper.props("questions")[0].answer).toHaveLength(2);
  });

  test('Checkbox with checked choice, but force default', async () => {
    const wrapper = mount(Form, {});
    wrapper.setProps({ questions: questionCheckboxCheckedForceDefault });
    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.props("questions")[0].answer[0]).toBe("Germany");
    expect(wrapper.props("questions")[0].answer).toHaveLength(1);
  });
});
