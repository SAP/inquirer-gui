<template>
  <v-textarea
    @input="onInput"
    :value="question.answer"
    aria-describedby="validation-message"
    :error-messages="question.validationMessage"
    hide-details="auto"
    dense
    outlined
  ></v-textarea>
</template>

<script>
import utils from "../utils";

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
