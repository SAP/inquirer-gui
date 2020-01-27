import { createLocalVue, mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Form from '../src/Form.vue';

const questionList = [
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
    default: "China"
  }
];

let localVue;

describe.skip('Question of type list', () => {
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
  });

  test('List', async () => {
    const wrapper = mount(Form, { localVue });
    wrapper.setProps({ questions: questionList });
    await localVue.nextTick();

    // const country = wrapper.find('div[role="combobox');
    // country.trigger('click');
    // await localVue.nextTick();

    // const usa = wrapper.find('div[role="option"');
    // console.dir(usa)
    // usa.trigger('click');
    // await localVue.nextTick();

    // expect(wrapper.emitted().answered).toBeTruthy();
    // const answered = wrapper.emitted().answered[0];
    // // test answers
    // expect(answered[0].country).toContain("USA");
  });
});
