<template>
  <v-text-field
    ref="login"
    :value="question.answer"
    append-outer-icon="mdi-account-arrow-right-outline"
    @change="onChange"
    @click:append-outer="onLogin"
    hide-details="auto"
    type="password"
    outlined
    dense
  ></v-text-field>
</template>

<script>
export default {
  name: "QuestionLogin",
  props: {
    question: Object
  },
  data() {
    return {
      pass: this.question.answer
    }
  },
  methods: {
    onLogin() {
      // this.question.answer = value;
      this.$emit("answerChanged", this.question.name, this.pass);
    },
    onChange(value) {
      this.pass = value;
    }
  }
};
</script>
