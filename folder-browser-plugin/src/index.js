import QuestionFolderBrowser from "./packages/QuestionFolderBrowser";

export default {
  install(Vue, options) {
    Vue.component('QuestionFolderBrowser', QuestionFolderBrowser);
    if (options) {
      options.plugin = {
        questionType: "folder-browser",
        component: QuestionFolderBrowser
      };
    }
  }
}
