import RadioGroup from "./packages/RadioGroup.vue";

export default {
  install(Vue, options) {
    Vue.component("RadioGroup", RadioGroup);
    if (options) {
      options.plugin = {
        questionType: "radio",
        component: RadioGroup,
      };
    }
  },
};
