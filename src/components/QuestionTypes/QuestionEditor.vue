<template>
  <div>
    <p>{{question._message}}</p>
    <v-textarea
      v-model="text"
      :placeholder="question.answer"
      aria-describedby="validation-message"
      :error-messages="question.validationMessage"
      outlined
    ></v-textarea>
  </div>
</template>

<script>
export default {
  name: "QuestionEditor",
  props: {
    question: Object
  },
  data() {
    return {
      text: undefined
    };
  },
  watch: {
    text: {
      handler(val) {
        this.$emit("answerChanged", this.question.name, val);
      }
    }
  }
};
</script>
