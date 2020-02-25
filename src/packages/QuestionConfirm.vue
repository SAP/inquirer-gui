<template>
  <div>
    <v-radio-group
      :value="question.answer"
      @change="onClick"
      row
      dense
    >
      <v-radio label="Yes" :value="true"></v-radio>
      <v-radio label="No" :value="false"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "QuestionExpand",
  props: {
    question: Object
  },
  methods: {
    onClick(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    }
  }
};
</script>
