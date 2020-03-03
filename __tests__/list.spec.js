import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import Form from '../src/Form.vue';

const questionList = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", {name:"China"}, "Israel"],
    default: "China"
  }
];

const questionListNoDefault = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"]
  }
];

const questionListInvalidChoices = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: "USA"
  }
];

const questionListDefaultAsIndex = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
    default: 1
  }
];

const questionListEmptyChoices = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: []
  }
];

describe('Question of type list', () => {
  test('List', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify, attachToDocument: true });
    wrapper.setProps({ questions: questionList });

    await Vue.nextTick();

    expect(wrapper.vm.$props.questions[0].answer).toBe(questionList[0].default);
  });

  test('List without default', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify, attachToDocument: true });
    wrapper.setProps({ questions: questionListNoDefault });

    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });

  test('List with invalid choices', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify, attachToDocument: true });
    wrapper.setProps({ questions: questionListInvalidChoices });

    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });

  test('List with default as index', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify, attachToDocument: true });
    wrapper.setProps({ questions: questionListDefaultAsIndex });

    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBe("Germany");
  });

  test('List with empty choices', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify, attachToDocument: true });
    wrapper.setProps({ questions: questionListEmptyChoices });

    await Vue.nextTick();
    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answeredLength = wrapper.emitted().answered.length;
    const answered = wrapper.emitted().answered[answeredLength - 1];
    // test answers
    expect(answered[0].country).toBeUndefined();
  });
});
