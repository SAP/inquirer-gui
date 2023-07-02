import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components/index.mjs';
import FormVue from "../src/Form.vue";

import QuestionFileBrowserPlugin from '../file-browser-plugin/src';

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
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe('Question of type file browser', () => {
  let vuetify

  beforeEach(() => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components
    });
  })

  test('File Browser', async () => {
    const options = {};
    const wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionFileBrowserPlugin, options]],
      },
      attachTo: document.body
    });
    await nextTick();
    
    wrapper.vm.registerPlugin(options.plugin);
    wrapper.setProps({ questions: questionFileBrowser });

    await nextTick();
    const icon = wrapper.findComponent({name: 'v-icon'});
    icon.trigger('click');

    await nextTick();
    expect(wrapper.props().questions[0].answer).toBe('/home/user');
  });

});
