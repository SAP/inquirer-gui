<template>
  <v-autocomplete
    :value="question.answer"
    @change="onAnswerChanged"
    :items="this.question._choices"
    item-text="name"
    item-value="value"
    hide-details="auto"
    :label="clickToDisplay"
    single-line
    :append-icon="'mdi-chevron-down'"
    outlined
    dense
  >
    <template v-slot:item="{ item, attrs, on }">
      <v-list-item :disabled="item.type==='separator'" v-bind="attrs" v-on="on">
        <v-divider v-if="getDividerType(item)==='divider'"></v-divider>
        <v-subheader v-else-if="getDividerType(item)==='header'">{{stripEscapeChars(item.line)}}</v-subheader>
        <v-list-item-content v-else>
          <v-list-item-title :id="attrs['aria-labelledby']" v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
const stripAnsi = require("strip-ansi");
// TODO: Get Inquirer.Separator() as props. (Inquirer Issue: https://github.com/SBoudrias/Inquirer.js/issues/543)
const Inquirer_Default_Separator = '\u001b[2m──────────────\u001b[22m';

export default {
  name: "QuestionList",
  methods: {
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    },
    getDividerType(item) {
      let type = undefined;
      if (item.type==='separator') {
        type = item.line === Inquirer_Default_Separator ? "divider" : "header";
      }
      return type ;
    },
    stripEscapeChars(value) {
      return stripAnsi(value);
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
