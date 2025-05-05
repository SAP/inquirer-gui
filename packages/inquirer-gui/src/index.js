import Form from "./Form.vue";
import vuetify from "./plugins/vuetify";
import Plugins from "./Plugins";
import "vuetify/dist/vuetify.min.css";

// Import the VSCode elements components
import "@vscode-elements/elements/dist/vscode-textarea/index.js";
import "@vscode-elements/elements/dist/vscode-textfield/index.js";
import "@vscode-elements/elements/dist/vscode-checkbox/index.js";
import "@vscode-elements/elements/dist/vscode-radio-group/index.js";
import "@vscode-elements/elements/dist/vscode-radio/index.js";
import "@vscode-elements/elements/dist/vscode-divider/index.js";

export default {
  install(Vue, options) {
    options.vuetify = vuetify;
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    Vue.component("Form", Form);
    Plugins.registerBuiltinPluginComponents(Vue);
  },
};
