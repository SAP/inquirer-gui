import QuestionAutoComplete from "./packages/QuestionAutoComplete.vue";

export default {
  install(Vue, options) {
    Vue.component('QuestionAutoComplete', QuestionAutoComplete);
    if (options) {
      options.plugin = {
        questionType: "autocomplete",
        component: QuestionAutoComplete
      };
    }
  }
}
