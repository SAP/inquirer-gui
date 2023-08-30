<template>
  <v-autocomplete
    @update:modelValue="onAnswerChanged"
    :modelValue="question.answer"
    :items="searchResults"
    item-title="name"
    item-value="value"
    hide-details="auto"
    :label="clickToDisplay"
    single-line
    menu-icon="mdi-chevron-down"
    @update:search="(value) => (searchInput = value)"
    @update:menu="onUpdateMenu"
    variant="outlined"
    density="compact"
    :menu-props="{ maxHeight: 150 }"
    :no-data-text="emptyText"
  >
    <template v-slot:item="{ item, props }">
      <v-list-item
        :disabled="item.type === 'separator'"
        v-bind="props"
        :title="item?.raw?.name"
        :value="item?.raw?.value"
      >
        <v-divider v-if="getDividerType(item) === 'divider'"></v-divider>
        <v-list-subheader v-else-if="getDividerType(item) === 'header'">{{
          stripEscapeChars(item.line)
        }}</v-list-subheader>
        <v-list-item-title v-else :id="props['aria-labelledby']">{{ item.name }}</v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:append-item>
      <div v-if="moreInfo" class="moreInfoBottom">
        <v-divider />
        <div class="moreInfo">{{ moreInfo }}</div>
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
import utils from "../utils";
import stripAnsi from "strip-ansi";

// TODO: Get Inquirer.Separator() as props. (Inquirer Issue: https://github.com/SBoudrias/Inquirer.js/issues/543)
const Inquirer_Default_Separator = "\u001b[2m──────────────\u001b[22m";

export default {
  name: "QuestionAutocomplete",
  methods: {
    onUpdateMenu(open) {
      if (open) {
        // WORKAROUND: fixes dialog menu popup position on first click
        // Issue: https://github.com/vuetifyjs/vuetify/issues/17126
        setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
      }
    },
    onAnswerChanged(value) {
      if (value) {
        this.$emit("answerChanged", this.question.name, value);
      }
    },
    getDividerType(item) {
      let type = undefined;
      if (item && item.type === "separator") {
        type =
          item.line === Inquirer_Default_Separator || item.line === this.stripEscapeChars(Inquirer_Default_Separator)
            ? "divider"
            : "header";
      }
      return type;
    },
    stripEscapeChars(value) {
      return stripAnsi(value);
    },
    searchResult(result) {
      this.searchResults = utils.normalizeChoices(result);
      this.$emit("setBusyIndicator", false);
      if (typeof this.question.additionalInfo === "function") {
        this.$emit("customEvent", this.question.name, "additionalInfo", this.additionalInfo);
      }
    },
    additionalInfo(message) {
      this.moreInfo = message;
    },
  },
  data() {
    return {
      searchInput: null,
      clickToDisplay: "Start typing to search",
      searchResults: [],
      moreInfo: null,
      emptyText: this.question.emptyText || undefined,
    };
  },
  watch: {
    searchInput: utils.debounce(function (val) {
      // Don't re-run search when answer is selected
      if (val !== null && val !== undefined && this.question.answer !== val) {
        this.$emit("customEvent", this.question.name, "source", this.searchResult, this.answers, val);
      }
    }, 280),
  },
  props: {
    question: Object,
    answers: Object,
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
.v-list-item .v-subheader {
  padding: 8px 0 8px 0;
}
.moreInfoBottom {
  position: sticky;
  bottom: 0;
}
.moreInfo {
  position: sticky;
  bottom: 0;
  text-align: right;
  background-color: var(--vscode-editorWidget-background, #ffffff);
  color: var(--vscode-foreground, #616161);
  padding: 8px 16px;
}
.v-list {
  padding-bottom: 0px;
}
</style>
