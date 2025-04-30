<template>
  <vscode-textfield ref="path" @change="onAnswerChanged" :value="question.answer">
    <template slot="content-after">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="onSelectFile">mdi-folder-outline</v-icon>
        </template>
        <span>Browse for files</span>
      </v-tooltip>
    </template>
  </vscode-textfield>
</template>

<script>
export default {
  name: "QuestionFileBrowser",
  props: {
    question: Object,
  },
  data: () => ({
    path: "/home/",
  }),
  methods: {
    setFilePath(path) {
      // eslint-disable-next-line vue/no-mutating-props
      this.question.answer = path;
      this.$emit("answerChanged", this.question.name, path);
    },
    onSelectFile() {
      this.$emit("customEvent", this.question.name, "getFilePath", this.setFilePath, this.question.answer);
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
