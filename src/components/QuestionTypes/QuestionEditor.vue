<template>
  <div>
    <p>{{question._message}}</p>
    <v-textarea
      v-model="text"
      :placeholder="question.answer"
      @input="onInput"
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
  data() {
    return {
      text: undefined
    };
  },
  methods: {
    onInput: utils.debounce(function(val) {
      this.$emit("answerChanged", this.question.name, val);
    }, 280)
  }
};
</script>
