<template>
  <div>
    <v-radio-group @update:modelValue="onClick" :modelValue="question.answer" inline density="compact">
      <v-radio label="Yes" :value="true"></v-radio>
      <v-radio label="No" :value="false"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "QuestionConfirm",
  props: {
    question: Object,
  },
  methods: {
    onClick(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    },
  },
};
</script>
