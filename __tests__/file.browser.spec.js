import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import QuestionFileBrowser from './QuestionFileBrowser.vue';

const questionFileBrowser = [
  {
    type: "file-browser",
    name: "configFile",
    message: "Config file",
    default: "/home/",
    getFilePath: async function (currentPath) {
      return `${currentPath}user`;
    }
  }
];

describe('Question of type file browser', () => {
  test('File Browser', async () => {
    Vue.component('QuestionFileBrowser', QuestionFileBrowser);
    await Vue.nextTick();
    const fileBrowserPlugin = {
      questionType: "file-browser",
      component: QuestionFileBrowser
    };

    const wrapper = mount(Form, {});
    wrapper.vm.registerPlugin(fileBrowserPlugin);
    await Vue.nextTick();
    wrapper.setProps({ questions: questionFileBrowser });
    await Vue.nextTick();
    const icon = wrapper.findComponent('button');
    icon.trigger('click');
    await Vue.nextTick();
    expect(wrapper.props().questions[0].answer).toBe('/home/user');
  });

});
