<template>
  <v-text-field
    @update:modelValue="onInput"
    :modelValue="question.answer"
    class="pa-0 ma-0"
    :type="getInputType(question.type)"
    hide-details="auto"
    density="compact"
    variant="outlined"
  ></v-text-field>
</template>

<script>
export default {
  name: "QuestionInput",
  props: {
    question: Object,
  },
  methods: {
    onInput(val) {
      this.$emit("answerChanged", this.question.name, val);
    },
    getInputType(questionType) {
      switch (questionType) {
        case "password":
          return "password";
        case "number":
          return "number";
        case "input":
          return "text";
      }
    },
  },
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
