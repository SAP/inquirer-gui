import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
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

let localVue;

describe('Question of type editor and filter func', () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  test('Editor', async () => {
    const value1 = "my lines";

    const wrapper = mount(Form, { localVue });
    wrapper.setProps({ questions: questionEditor });
    await localVue.nextTick();

    const notes = wrapper.find('textarea');
    notes.element.value = value1;
    notes.trigger('input');

    await localVue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].notes).toEqual(`${value1}${filterSuffix}`);
  });

});
