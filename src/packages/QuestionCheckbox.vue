<template>
  <div>
  <p class="question-label">{{question._message}}</p>
    <v-checkbox
      v-for="(item) in question._choices"
      dense
      stacked
      v-model="options"
      :key="item.value"
      :label="item.name"
      :value="item.value"
      :error-messages="question.validationMessage"
    ></v-checkbox>
  </div>
</template>

<script>

export default {
  name: "QuestionCheckbox",
  props: {
    question: Object
  },
  data() {
    return {
      options: this.question.default ? this.question.default : []
    };
  },
  watch: {
    options: {
      handler(val) {
        this.$emit("answerChanged", this.question.name, val);
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