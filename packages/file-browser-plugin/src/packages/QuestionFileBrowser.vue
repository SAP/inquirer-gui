<template>
  <v-text-field
    ref="path"
    @update:modelValue="onAnswerChanged"
    :modelValue="question.answer"
    hide-details="auto"
    density="compact"
    variant="outlined"
  >
    <template v-slot:append-inner>
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="onSelectFile">mdi-folder-outline</v-icon>
        </template>
        <span>Browse for files</span>
      </v-tooltip>
    </template>
  </v-text-field>
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
        this.$emit("answerChanged", this.question.name, answer);
      }
    },
  },
};
</script>
