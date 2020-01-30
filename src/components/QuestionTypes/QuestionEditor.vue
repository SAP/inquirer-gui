<template>
  <div>
    <p>{{question._message}}</p>
    <v-textarea
      @input="onInput"
      :value="question.answer"
      aria-describedby="validation-message"
      :error-messages="question.validationMessage"
      outlined
    ></v-textarea>
  </div>
</template>

<script>
import utils from "../../utils";

export default {
  name: "QuestionEditor",
  props: {
    question: Object
  },
  methods: {
    onInput: utils.debounce(function(val) {
      this.$emit("answerChanged", this.question.name, val);
    }, 280)
  }
};
</script>
