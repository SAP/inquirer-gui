<template>
      <v-text-field
        ref="path"
        :value="question.answer"
        @input="onAnswerChanged"
        hide-details="auto"
        outlined
        dense
      >
        <template slot="append">
          <v-tooltip left>
            <template v-slot:activator="{on}">
              <v-icon
                v-on="on"
                @click="onSelectFile"
              >mdi-folder-outline</v-icon>
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
