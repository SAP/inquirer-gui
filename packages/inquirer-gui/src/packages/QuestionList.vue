<template>
  <v-autocomplete
    @update:modelValue="onAnswerChanged"
    :modelValue="question.answer"
    :items="this.question._choices"
    item-title="name"
    item-value="value"
    hide-details="auto"
    :label="clickToDisplay"
    single-line
    menu-icon="mdi-chevron-down"
    @update:search="searchInput"
    @update:menu="onUpdateMenu"
    variant="outlined"
    density="compact"
  >
    <template v-slot:item="{ item, props }">
      <v-list-item
        :disabled="item.type === 'separator'"
        v-bind="props"
        :title="item?.raw?.name"
        :value="item?.raw?.value"
      >
        <v-divider v-if="getDividerType(item.raw) === 'divider'"></v-divider>
        <v-list-subheader v-else-if="getDividerType(item.raw) === 'header'">{{
          stripEscapeChars(item.raw.line)
        }}</v-list-subheader>
        <v-list-item-title v-else :id="props['aria-labelledby']">{{
          item.name
        }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import stripAnsi from "strip-ansi";
// TODO: Get Inquirer.Separator() as props. (Inquirer Issue: https://github.com/SBoudrias/Inquirer.js/issues/543)
const Inquirer_Default_Separator = "\u001b[2m──────────────\u001b[22m";

export default {
  name: "QuestionList",
  methods: {
    onUpdateMenu(open) {
      if (open) {
        // WORKAROUND: fixes dialog menu popup position on first click
        // Issue: https://github.com/vuetifyjs/vuetify/issues/17126
        setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
      }
    },
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    },
    getDividerType(item) {
      let type = undefined;
      if (item.type === "separator") {
        type =
          item.line === Inquirer_Default_Separator ||
          item.line === this.stripEscapeChars(Inquirer_Default_Separator)
            ? "divider"
            : "header";
      }
      return type;
    },
    stripEscapeChars(value) {
      return stripAnsi(value);
    },
  },
  data() {
    return {
      searchInput: null,
      clickToDisplay: "Click to display the list of options",
    };
  },
  props: {
    question: Object,
  },
};
</script>

<style scoped>
.list-group {
  margin-bottom: 15px;
}
.list-group-item:hover {
  cursor: pointer;
}
.v-list-item .v-list-subheader {
  padding: 8px 0 8px 0;
}
</style>
