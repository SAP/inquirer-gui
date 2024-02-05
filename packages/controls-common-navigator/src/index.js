import CommonNavigator from "./CommonNavigator.vue";
import vuetify from "./plugins/vuetify";
import "vuetify/dist/vuetify.min.css";

export default {
  install(Vue, options) {
    options.vuetify = vuetify;
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    Vue.component("CommonNavigator", CommonNavigator);
  },
};
