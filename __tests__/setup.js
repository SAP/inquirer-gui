import Vue from 'vue';
import Vuetify from 'vuetify';
import "material-design-icons-iconfont/dist/material-design-icons.css";
import '@mdi/font/css/materialdesignicons.css'

// Not using localVue (https://vue-test-utils.vuejs.org/api/options.html#localvue) because of this issue:
//   https://github.com/vuetifyjs/vuetify/issues/4964

Vue.use(Vuetify, {
  iconfont: 'mdi'
})

new Vue({});
