import QuestionTiles from "./packages/QuestionTiles.vue";

export default {
  install(Vue, options) {
    Vue.component("QuestionTiles", QuestionTiles);
    if (options) {
      options.plugin = {
        questionType: "tiles",
        component: QuestionTiles,
      };
    }
  },
};
