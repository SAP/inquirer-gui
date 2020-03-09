import Vue from "vue";
import QuestionFileBrowser from "./packages/QuestionFileBrowser";

export default {
  install(Vue, options) {
    Vue.component('QuestionFileBrowser', QuestionFileBrowser);
    if (options) {
      options.plugin = {
        questionType: "file-browser",
        component: QuestionFileBrowser
      };
    }
  }
}


