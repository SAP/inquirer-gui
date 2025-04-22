<template>
  <vscode-radio-group @change="onClick" :value="question.answer">
    <vscode-radio :label="question.labelTrue || 'Yes'" :value="true"></vscode-radio>
    <vscode-radio :label="question.labelFalse || 'No'" :value="false"></vscode-radio>
  </vscode-radio-group>
</template>

<script>
export default {
  name: "QuestionConfirm",
  props: {
    question: Object,
  },
  methods: {
    onClick(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer.target.value === "true");
      }
    },
  },
};
</script>
