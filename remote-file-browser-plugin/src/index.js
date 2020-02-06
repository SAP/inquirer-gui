import Vue from "vue";
import QuestionRemoteFileBrowser from "./packages/QuestionRemoteFileBrowser";

export default {
  install(Vue, options) {
    Vue.component('QuestionRemoteFileBrowser', QuestionRemoteFileBrowser);
    if (options) {
      options.plugin = {
        questionType: "remote-file-browser",
        component: QuestionRemoteFileBrowser
      };
    }
  }
}


