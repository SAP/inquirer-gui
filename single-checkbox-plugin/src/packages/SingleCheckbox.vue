<template>
  <div>
    <div class="pa-0 ma-0">
      <div class="MultiInputRow">
        <input type="checkbox" name="" :id="getId('input')" @change="onAnswerChanged" v-model="checkVal">
        <span class="question-hint">{{ question.title }}</span>
        <span class="question-hint" v-if="question.hint">
          <v-tooltip location="top" max-width="350px">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
            </template>
            <span>{{ question.hint }}</span>
          </v-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "QuestionCompactCheckbox",
  data() {
    return {
      checkVal: this.question.answer
    }
  },
  props: {
    question: Object
  },
  methods: {
    getId(name) {
      return this.question.name + "_" + name;
    },
    onAnswerChanged() {
      this.$emit("answerChanged", this.question.name, this.checkVal);
    }
  }
};
</script>

<style>
.question-hint {
  padding-left: 4px;
}

.MultiInputRow {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: start;
}
</style>