import Vue from "vue";
import QuestionTiles from "./packages/QuestionTiles";

export default {
  install(Vue, options) {
    Vue.component('QuestionTiles', QuestionTiles);
    if (options) {
      options.plugin = {
        questionType: "tiles",
        component: QuestionTiles
      };
    }
  }
}


