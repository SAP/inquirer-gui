import { mount } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
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

// TODO: fix 'infinite update loop' issues and unskip
describe.skip('Question of type list', () => {
  test('List', async () => {
    const vuetify = new Vuetify({});

    new Vue({ vuetify });

    document.body.setAttribute('data-app', 'true');
    const wrapper = mount(Form, { vuetify });
    wrapper.setProps({ questions: questionList });

    await Vue.nextTick();
    const select = (wrapper.find('div.v-select__slot'))

    // The following line causes this error:
    //   [Vue warn]: You may have an infinite update loop in a component render function.

    select.trigger('click')
    await Vue.nextTick();

    expect(wrapper.emitted().answered).toBeTruthy();
    const answered = wrapper.emitted().answered[0];
    // test answers
    expect(answered[0].country).toContain("USA");
  });
});
