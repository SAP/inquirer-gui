import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
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

let localVue;

describe('Question of type checkbox', () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  test('Checkbox', async () => {
    const wrapper = mount(Form, { localVue });
    wrapper.setProps({ questions: questionCheckbox });
    await localVue.nextTick();

    const citizenship = wrapper.find('input[role="checkbox"');
    citizenship.trigger('click');

    await localVue.nextTick();
    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].citizenship).toContain("USA");
  });
});
