<template>
  <vscode-textarea @change="onInput" :value="question.answer"></vscode-textarea>
</template>

<script>
import utils from "../utils";

export default {
  name: "QuestionEditor",
  props: {
    question: Object,
  },
  methods: {
    onInput: utils.debounce(function (val) {
      this.$emit("answerChanged", this.question.name, val.target.value);
    }, 280),
  },
};
</script>

<style scoped>
vscode-textarea {
  width: 100%;
  min-height: 184px;
  --vscode-font-size: 16px;
}
</style>
