import Form from './Form.vue';
import vuetify from "./plugins/vuetify";

Object.assign(Form, vuetify);

export default {
  install (Vue) {
    Vue.component('Form', Form);
  }
}