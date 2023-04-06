<template>
  <v-autocomplete
    :value="question.answer"
    @change="onAnswerChanged"
    :items="searchResults"
    item-text="name"
    item-value="value"
    hide-details="auto"
    :label="clickToDisplay"
    single-line
    :append-icon="'mdi-chevron-down'"
    :search-input.sync="searchInput"
    outlined
    dense
    :menu-props="{ maxHeight: 150 }"
  >
    <template v-slot:item="{ item, attrs, on }">
      <v-list-item :disabled="item.type === 'separator'" v-bind="attrs" v-on="on">
        <v-divider v-if="getDividerType(item) === 'divider'"></v-divider>
        <v-subheader v-else-if="getDividerType(item) === 'header'">{{ stripEscapeChars(item.line) }}</v-subheader>
        <v-list-item-content v-else>
          <v-list-item-title :id="attrs['aria-labelledby']" v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <div v-if="moreInfo" slot="append-item" class="moreInfoBottom">
      <v-divider />
      <div class="moreInfo">{{ moreInfo }}</div>
    </div>
  </v-autocomplete>
</template>

<script>
import utils from "../utils";
const stripAnsi = require("strip-ansi");
// TODO: Get Inquirer.Separator() as props. (Inquirer Issue: https://github.com/SBoudrias/Inquirer.js/issues/543)
const Inquirer_Default_Separator = "\u001b[2m──────────────\u001b[22m";

export default {
  name: "QuestionAutocomplete",
  methods: {
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
      if (typeof result === "string") {
        this.searchResults = [];
      } else {
        this.searchResults = utils.normalizeChoices(result);
      }
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
    };
  },
  watch: {
    searchInput: utils.debounce(function(val) {
      // Don't re-run search when answer is selected
      if (val !== null && val !== undefined && this.question.answer !== val) {
        this.$emit("customEvent", this.question.name, "source", this.searchResult, this.answers, val);
      }
    }, 280)
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
/** todo : only if last child is moreInfo */
.v-list {
  padding-bottom: 0px;
}
</style>
