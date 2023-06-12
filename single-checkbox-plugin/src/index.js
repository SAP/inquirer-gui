import SingleCheckBox from "./packages/SingleCheckbox";

export default {
  install(Vue, options) {
    Vue.component('SingleCheckbox', SingleCheckBox);
    if (options) {
      options.plugin = {
        questionType: "single-checkbox",
        component: SingleCheckBox
      };
    }
  }
}
