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
          <v-icon v-bind="props" @click="onSelectFolder"
            >mdi-folder-outline</v-icon
          >
        </template>
        <span>Browse for folder</span>
      </v-tooltip>
    </template>
  </v-text-field>
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
      this.$emit(
        "customEvent",
        this.question.name,
        "getPath",
        this.setFolderPath,
        this.question.answer,
      );
    },
    onAnswerChanged(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    },
  },
};
</script>
