import QuestionDateTime from "./packages/QuestionDateTime.vue";

export default {
  install(Vue, options) {
    Vue.component("QuestionDateTime", QuestionDateTime);
    if (options) {
      options.plugin = {
        questionType: "date",
        component: QuestionDateTime,
      };
    }
  },
};
