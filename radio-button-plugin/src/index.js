import RadioGroup from "./packages/RadioGroup";

export default {
  install(Vue, options) {
    Vue.component('RadioGroup', RadioGroup);
    if (options) {
      options.plugin = {
        questionType: "radio",
        component: RadioGroup
      };
    }
  }
}
