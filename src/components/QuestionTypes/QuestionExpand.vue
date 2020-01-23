<template>
  <div class="question-expand-container">
    <p class="question-label">{{currentQuestion._message}}</p>
    <v-card outlined>
      <v-list>
        <v-list-item-group :value="currentQuestion.answer" @change="onClick">
          <v-list-item
            v-for="(choice, i) in currentQuestion._choices"
            :key="i"
            :value="choice.value"
          >
            <v-list-item-content>
              <v-list-item-title v-text="choice.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "QuestionExpand",
  props: {
    currentQuestion: Object
  },
  methods: {
    onClick(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.currentQuestion.name, answer);
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