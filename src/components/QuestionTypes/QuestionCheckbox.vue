<template>
  <div>
  <p class="question-label">{{currentQuestion._message}}</p>
    <v-checkbox
      v-for="(item) in currentQuestion._choices"
      dense
      stacked
      v-model="options"
      :key="item.value"
      :label="item.name"
      :value="item.value"
      :error-messages="currentQuestion.validationMessage"
    ></v-checkbox>
  </div>
</template>

<script>

export default {
  name: "QuestionCheckbox",
  props: {
    currentQuestion: Object
  },
  data() {
    return {
      options: this.currentQuestion.default ? this.currentQuestion.default : []
    };
  },
  watch: {
    options: {
      handler(val) {
        this.$emit("answerChanged", this.currentQuestion.name, val);
      }
    }
  }
    // TODO: handle default values of type object (with properties name, value and short)
};
</script>

<style>
.v-messages {
  min-height: 0px;
}
</style>