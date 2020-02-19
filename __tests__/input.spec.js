import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import utils from './utils';

const questionInput = [
  {
    type: "input",
    name: "input",
    message: "An input",
    default: "default input",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
        return "Name must be at least 2 characters long";
      }
    }
  }
];

const questionPassword = [
  {
    type: "password",
    name: "password",
    message: "A password"
  }
];

const questionNumber = [
  {
    type: "number",
    name: "number",
    message: "A number",
    default: "0"
  },
];

const questionNumberNoDefault = [
  {
    type: "number",
    name: "number",
    message: "A number"
  },
];

const questionsConditional = [
  {
    type: "input",
    name: "condition",
    default: "some value"
  },
  {
    type: "input",
    name: "conditional",
    when: function (answers) {
      return (answers.condition !== "hide");
    }
  },
  {
    type: "input",
    name: "conditional2",
    when: false
  },
  {
    type: "input",
    name: "conditional3",
    when: true
  }
];

const questionsMessageAsFunction = [
  {
    type: "input",
    name: "trigger",
    default: "some value"
  },
  {
    type: "input",
    name: "message",
    message: function (answers) {
      return (`${answers.trigger}-message`);
    }
  }
];

const questionsDefaultAsFunction = [
  {
    type: "input",
    name: "trigger",
    default: "some value"
  },
  {
    type: "input",
    name: "default",
    default: function (answers) {
      return (`${answers.trigger}-default`);
    }
  }
];

const questionInputNoMessage = [
  {
    type: "input",
    name: "input with no message"
  }
];

const questionInputDefaultException = [
  {
    type: "input",
    name: "inputDefaultException",
    message: "An input",
    default: function (input) {
      throw("exception");
    }
  }
];

describe('Questions of type input, password and number', () => {
  test('Input', async () => {
    const value1 = "my input";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionInput });
    await Vue.nextTick();

    const name = wrapper.find('input');
    name.element.value = value1;
    name.trigger('input');

    // wait to account for debounce
    await utils.sleep(300);
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].input).toEqual(value1);
    // test validation
    expect(answered[1]).toBeUndefined();
  });

  test('Input with invalid input', async () => {
    const value1 = "m";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionInput });
    await Vue.nextTick();

    const name = wrapper.find('input');
    name.element.value = value1;
    name.trigger('input');

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].input).toEqual(value1);
    // test validation
    expect(answered[1]).toHaveProperty("input");
  });

  test('Password', async () => {
    const value1 = "my password";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionPassword });
    await Vue.nextTick();

    const name = wrapper.find('input');
    name.element.value = value1;
    name.trigger('input');

    // wait to account for debounce
    await utils.sleep(300);

    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].password).toEqual(value1);
  });

  test('Number', async () => {
    const value1 = 5;

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionNumber });
    await Vue.nextTick();

    const name = wrapper.find('input');
    name.element.value = value1;
    name.trigger('input');

    // wait to account for debounce
    await utils.sleep(300);
    expect(wrapper.emitted().answered).toBeTruthy();
    const emittedLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[emittedLength-1];
    // test answers
    expect(answered[0].number).toEqual(value1.toString());
  });

  test('Number without default', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionNumber });
    await Vue.nextTick();

    const name = wrapper.find('input');
    expect(name.element.value).toBe("0");
  });

  test('Input with conditions', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionsConditional });
    await Vue.nextTick();

    let inputs = wrapper.findAll('input');
    expect(inputs.length).toEqual(3);
    inputs.at(0).element.value = "hide";
    inputs.at(0).trigger('input');
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll('input');
    expect(inputs.length).toEqual(2);
  });

  test('Input with message as a function', async () => {
    const newValue = "another value";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionsMessageAsFunction });
    await Vue.nextTick();

    let inputs = wrapper.findAll('input');
    inputs.at(0).element.value = newValue;
    inputs.at(0).trigger('input');
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll('p.question-label');
    expect(inputs.at(1).element.innerHTML).toBe(`${newValue}-message`);
  });

  test('Input with default as a function', async () => {
    const newValue = "another value";

    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionsDefaultAsFunction });
    await Vue.nextTick();

    let inputs = wrapper.findAll('input');
    inputs.at(0).element.value = newValue;
    inputs.at(0).trigger('input');
    // wait to account for debounce
    await utils.sleep(300);

    inputs = wrapper.findAll('input');
    expect(inputs.at(1).element.value).toBe(`${newValue}-default`);
  });

  test('Input with no message', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionInputNoMessage });
    await Vue.nextTick();

    const inputs = wrapper.findAll('p.question-label');
    // message should default to question's name
    expect(inputs.at(0).element.innerHTML).toBe(questionInputNoMessage[0].name);
  });

  test('Input with exception in default()', async () => {
    const wrapper = mount(Form, { });
    wrapper.setProps({ questions: questionInputDefaultException });
    await Vue.nextTick();

    expect(wrapper.props("questions")[0]._default).toBeUndefined();
  });
});
