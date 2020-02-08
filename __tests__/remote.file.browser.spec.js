import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Form from '../src/Form.vue';
import QuestionRemoteFileBrowser from './QuestionRemoteFileBrowser.vue';

const questionRemoteFileBrowser = [
  {
    type: "remote-file-browser",
    name: "configFile",
    message: "Config file",
    default: "/home/",
    getFilePath: async function (currentPath) {
      return `${currentPath}user`;
    }
  }
];

describe('Question of type remote file browser', () => {
  test('Remote File Browser', async () => {
    Vue.component('QuestionRemoteFileBrowser', QuestionRemoteFileBrowser);
    await Vue.nextTick();
    const remoteFileBrowserPlugin = {
      questionType: "remote-file-browser",
      component: QuestionRemoteFileBrowser
    };

    const wrapper = mount(Form, {});
    wrapper.vm.registerPlugin(remoteFileBrowserPlugin);
    await Vue.nextTick();
    wrapper.setProps({ questions: questionRemoteFileBrowser });
    await Vue.nextTick();
    const icon = wrapper.find('i');
    icon.trigger('click');
    await Vue.nextTick();
    expect(wrapper.props().questions[0].answer).toBe('/home/user');
  });

});
