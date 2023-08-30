import QuestionLabel from "./packages/QuestionLabel.vue";

export default {
  install(Vue, options) {
    Vue.component("QuestionLabel", QuestionLabel);
    if (options) {
      options.plugin = {
        questionType: "label",
        component: QuestionLabel,
      };
    }
  },
};
