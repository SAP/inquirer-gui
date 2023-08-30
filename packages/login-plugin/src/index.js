import QuestionLogin from "./packages/QuestionLogin.vue";

export default {
  install(Vue, options) {
    Vue.component("QuestionLogin", QuestionLogin);
    if (options) {
      options.plugin = {
        questionType: "login",
        component: QuestionLogin,
      };
    }
  },
};
