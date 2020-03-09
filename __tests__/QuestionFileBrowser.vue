<template>
  <v-text-field
    ref="path"
    :value="question.answer"
    append-outer-icon="folder"
    @click:append-outer="onSelectFile"
    readonly
    hide-details="auto"
    outlined
    dense
  ></v-text-field>
</template>

<script>
export default {
  name: "QuestionFileBrowser",
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
    onInput(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    }
  }
};
</script>
