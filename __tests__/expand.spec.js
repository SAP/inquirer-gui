import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Form from '../src/Form.vue';

const questionExpand = [
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"],
    default: "No"
  }
];

let localVue;

describe('Question of type expand', () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  test('Expand', async () => {
    const wrapper = mount(Form, { localVue });
    wrapper.setProps({ questions: questionExpand });
    await localVue.nextTick();

    const expand = wrapper.find('div[role="listitem"');
    expand.trigger('click');

    await localVue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].agree).toEqual(`Yes`);
  });
});
