<template>
  <div class="question-expand-container">
    <p class="question-label">{{currentQuestion._message}}</p>
    <v-btn-toggle dense :value="currentQuestion.answer" @change="onClick">
      <v-btn :value="true">Yes</v-btn>
      <v-btn :value="false">No</v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
export default {
  name: "QuestionExpand",
  props: {
    currentQuestion: Object
  },
  methods: {
    onClick(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.currentQuestion.name, answer);
      }
    }
  }
};
</script>
