import Vue from 'vue';
import Vuetify from 'vuetify';

// Not using localVue (https://vue-test-utils.vuejs.org/api/options.html#localvue) because of this issue:
//   https://github.com/vuetifyjs/vuetify/issues/4964

Vue.use(Vuetify, {})

new Vue({});
