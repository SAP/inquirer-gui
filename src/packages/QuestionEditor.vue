<template>
  <v-textarea
    @update:modelValue="onInput"
    :modelValue="question.answer"
    aria-describedby="validation-message"
    hide-details="auto"
    rows=7
    density="compact"
    variant="outlined"
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
