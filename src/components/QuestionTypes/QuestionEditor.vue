<template>
  <div>
    <p>{{currentQuestion._message}}</p>
    <v-textarea
      v-model="text"
      :placeholder="currentQuestion.answer"
      aria-describedby="validation-message"
      :error-messages="currentQuestion.validationMessage"
      outlined
    ></v-textarea>
  </div>
</template>

<script>
export default {
  name: "QuestionEditor",
  props: {
    currentQuestion: Object
  },
  data() {
    return {
      text: undefined
    };
  },
  watch: {
    text: {
      handler(val) {
        this.$emit("answerChanged", this.currentQuestion.name, val);
      }
    }
  }
};
</script>
