<template>
  <div>
    <p class="question-label">{{currentQuestion._message}}</p>
    <v-text-field
      v-model="text"
      class="pa-0 ma-0"
      :placeholder="currentQuestion.answer"
      :type="getInputType(currentQuestion.type)"
      :error-messages="currentQuestion.validationMessage"
      outlined
      dense
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: "QuestionInput",
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
      async handler(val) {
        this.$emit("answerChanged", this.currentQuestion.name, val);
      }
    }
  },
  methods: {
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