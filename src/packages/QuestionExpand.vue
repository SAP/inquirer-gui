<template>
  <v-card outlined>
    <v-list>
      <v-list-item-group :value="question.answer" @change="onClick">
        <v-list-item v-for="(choice, i) in question._choices" :key="i" :value="choice.value">
          <v-list-item-content>
            <v-list-item-title v-text="choice.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
// TODO: Support separators
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

<style scoped>
.v-btn-toggle {
  flex-direction: column;
}
</style>