<template>
  <v-select
    :value="question.answer"
    @change="onAnswerChanged"
    :items="this.question._choices"
    item-text="name"
    item-value="value"
    :error-messages="question.validationMessage"
    hide-details="auto"
    :label="clickToDisplay"
    outlined
    dense
  >
    <template v-slot:item="{ item, attrs, on }">
      <v-list-item :disabled="item.type==='separator'" v-bind="attrs" v-on="on">
        <v-divider v-if="item.type==='separator'" disabled></v-divider>
        <v-list-item-content v-else>
          <v-list-item-title :id="attrs['aria-labelledby']" v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "QuestionList",
  methods: {
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    }
  },
  data() {
    return {
      clickToDisplay: "Click to display the list of options"
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
