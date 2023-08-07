import Form from './Form.vue';
import vuetify from "./plugins/vuetify";
import Plugins from './Plugins';
import 'vuetify/dist/vuetify.min.css';

export default {
  install (Vue, options) {
    options.vuetify = vuetify;
    Vue.component('Form', Form);
    Plugins.registerBuiltinPluginComponents(Vue);
  }
}
