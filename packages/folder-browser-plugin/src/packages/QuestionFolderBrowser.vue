<template>
  <vscode-textfield ref="path" @change="onAnswerChanged" :value="question.answer">
    <template slot="content-after">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="onSelectFolder">mdi-folder-outline</v-icon>
        </template>
        <span>Browse for folder</span>
      </v-tooltip>
    </template>
  </vscode-textfield>
</template>

<script>
export default {
  name: "QuestionFolderBrowser",
  props: {
    question: Object,
  },
  data: () => ({
    path: "/home/",
  }),
  methods: {
    setFolderPath(path) {
      this.question.answer = path;
      this.$emit("answerChanged", this.question.name, path);
    },
    onSelectFolder() {
      this.$emit("customEvent", this.question.name, "getPath", this.setFolderPath, this.question.answer);
    },
    onAnswerChanged(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer.target.value);
      }
    },
  },
};
</script>
<style scoped>
vscode-textfield {
  padding-inline-end: 11px;
}
</style>
