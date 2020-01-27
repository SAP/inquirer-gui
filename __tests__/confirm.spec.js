import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Form from '../src/Form.vue';

const questionConfirm = [
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure?",
    default: false
  }
];

let localVue;

describe('Question of type confirm', () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  test('Confirm', async () => {
    const wrapper = mount(Form, { localVue });
    wrapper.setProps({ questions: questionConfirm });
    await localVue.nextTick();

    const confirm = wrapper.find('button');
    confirm.trigger('click');

    await localVue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].confirm).toEqual(true);
  });
});
