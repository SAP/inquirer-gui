import QuestionInput from "./packages/QuestionInput.vue";
import QuestionEditor from "./packages/QuestionEditor.vue";
import QuestionList from "./packages/QuestionList.vue";
import QuestionConfirm from "./packages/QuestionConfirm.vue";
import QuestionCheckbox from "./packages/QuestionCheckbox.vue";
import QuestionExpand from "./packages/QuestionExpand.vue";

export default {

  registerBuiltinPluginComponents: function(app) {
    // register builtin form elements
    app.component('QuestionInput', QuestionInput);
    app.component('QuestionEditor', QuestionEditor);
    app.component('QuestionList', QuestionList);
    app.component('QuestionConfirm', QuestionConfirm);
    app.component('QuestionCheckbox', QuestionCheckbox);
    app.component('QuestionExpand', QuestionExpand);
  },
  registerBuiltinPlugins: function() {
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
      }
    ];
    return plugins;
  }
}