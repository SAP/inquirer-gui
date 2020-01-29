<template>
  <div>
    <p class="question-label">{{currentQuestion._message}}</p>

    <v-select
      v-model="selected"
      :items="this.currentQuestion._choices"
      item-text="name"
      item-value="value"
      :error-messages="currentQuestion.validationMessage"
      outlined
      dense
    ></v-select>
  </div>
</template>

<script>
export default {
  name: "QuestionList",
  data() {
    return {
      selected: this.currentQuestion.answer
    };
  },
  watch: {
    selected: {
      immediate: true,
      handler: function(selectedvalue) {
        this.$emit("answerChanged", this.currentQuestion.name, selectedvalue);
      }
    }
  },
  props: {
    currentQuestion: Object
  }
};
</script>

<style scoped>
.list-group {
  margin-bottom: 15px;
}
.list-group-item:hover {
  cursor: pointer;
}
</style>
