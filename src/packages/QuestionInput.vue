<template>
  <v-text-field
    @input="onInput"
    :value="question.answer"
    class="pa-0 ma-0"
    :type="getInputType(question.type)"
    hide-details="auto"
    outlined
    dense
  ></v-text-field>
</template>

<script>
import utils from "../utils";

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