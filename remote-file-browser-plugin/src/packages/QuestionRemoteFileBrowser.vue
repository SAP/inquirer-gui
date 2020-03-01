<template>
  <v-text-field
    ref="path"
    :value="question.answer"
    append-outer-icon="mdi-folder-outline"
    @click:append-outer="onSelectFile"
    @input="onAnswerChanged"
    hide-details="auto"
    outlined
    dense
  ></v-text-field>
</template>

<script>
export default {
  name: "QuestionRemoteFileBrowser",
  props: {
    question: Object
  },
  data: () => ({
    path: "/home/"
  }),
  methods: {
    setFilePath(path) {
      this.question.answer = path;
      this.$emit("answerChanged", this.question.name, path);
    },
    onSelectFile() {
      this.$emit(
        "customEvent",
        this.question.name,
        "getFilePath",
        this.setFilePath,
        this.question.answer
      );
    },
    onAnswerChanged(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    }
  }
};
</script>
