import Vue from "vue";
import QuestionInput from "./packages/QuestionInput";
import QuestionEditor from "./packages/QuestionEditor";
import QuestionList from "./packages/QuestionList";
import QuestionConfirm from "./packages/QuestionConfirm";
import QuestionCheckbox from "./packages/QuestionCheckbox";
import QuestionExpand from "./packages/QuestionExpand";
import QuestionTiles from "./packages/QuestionTiles";

export default {
  registerBuiltinPlugins: function() {
    // register builtin form elements
    Vue.component('QuestionInput', QuestionInput);
    Vue.component('QuestionEditor', QuestionEditor);
    Vue.component('QuestionList', QuestionList);
    Vue.component('QuestionConfirm', QuestionConfirm);
    Vue.component('QuestionCheckbox', QuestionCheckbox);
    Vue.component('QuestionExpand', QuestionExpand);
    Vue.component('QuestionTiles', QuestionTiles);

    const plugins = [
      {
        questionType: "input",
        component: QuestionInput
      },
      {
        questionType: "password",
        component: QuestionInput
      },
      {
        questionType: "number",
        component: QuestionInput
      },
      {
        questionType: "editor",
        component: QuestionEditor
      },
      {
        questionType: "list",
        component: QuestionList
      },
      {
        questionType: "rawlist",
        component: QuestionList
      },
      {
        questionType: "confirm",
        component: QuestionConfirm
      },
      {
        questionType: "checkbox",
        component: QuestionCheckbox
      },
      {
        questionType: "expand",
        component: QuestionExpand
      },
      {
        questionType: "tiles",
        component: QuestionTiles
      }
    ];
    return plugins;
  }
}