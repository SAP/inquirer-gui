<template>
  <div>
    <p class="question-label">{{question._message}}</p>

    <v-select
      v-model="selected"
      :items="this.question._choices"
      item-text="name"
      item-value="value"
      :error-messages="question.validationMessage"
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
      selected: this.question.answer
    };
  },
  watch: {
    selected: {
      immediate: true,
      handler: function(selectedvalue) {
        this.$emit("answerChanged", this.question.name, selectedvalue);
      }
    }
  },
  props: {
    question: Object
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
