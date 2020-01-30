<template>
  <div>
    <p class="question-label">{{question._message}}</p>
    <v-text-field
      @input="onInput"
      :value="question.answer"
      class="pa-0 ma-0"
      :type="getInputType(question.type)"
      :error-messages="question.validationMessage"
      outlined
      dense
    ></v-text-field>
  </div>
</template>

<script>
import utils from "../../utils";

export default {
  name: "QuestionInput",
  props: {
    question: Object
  },
  methods: {
    onInput: utils.debounce(function(val) {
      this.$emit("answerChanged", this.question.name, val);
    }, 280),
    getInputType(questionType) {
      switch (questionType) {
        case "password":
          return "password";
        case "number":
          return "number";
        case "input":
          return "text";
        default:
          return "text";
      }
    }
  }
};
</script>

<style>
.v-input {
  margin: 0;
  padding: 0px;
}

.col {
  padding-bottom: 0px;
}
</style>