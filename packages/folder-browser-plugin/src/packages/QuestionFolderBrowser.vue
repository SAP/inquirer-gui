<template>
  <vscode-textfield ref="textfield" @change="onAnswerChanged" :value="question.answer">
    <template slot="content-after">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="onSelectFolder">mdi-folder-outline</v-icon>
        </template>
        <span>Browse for folder</span>
      </v-tooltip>
    </template>
  </vscode-textfield>
</template>

<script>
// @vscode-elements/elements@1.11.0 hardcodes line-height: 18px on the inner
// <input> with no CSS custom property hook. Remove this patch when the library
// exposes one (e.g. --vscode-input-line-height).
function applyPatch(el) {
  if (el && el.shadowRoot && !el.shadowRoot.querySelector("style.line-height-patch")) {
    const style = document.createElement("style");
    style.className = "line-height-patch";
    // !important needed to override the library's hardcoded constructed stylesheet
    style.textContent = "input { line-height: normal !important; }";
    el.shadowRoot.appendChild(style);
  }
}

function mountLineHeightPatch(el) {
  if (el && typeof el.updateComplete !== "undefined") {
    el.updateComplete.then(() => applyPatch(el));
  } else {
    applyPatch(el); // fallback for non-Lit environments; usually a no-op in tests
  }
}

export default {
  name: "QuestionFolderBrowser",
  props: {
    question: Object,
  },
  mounted() {
    mountLineHeightPatch(this.$refs.textfield);
  },
  data: () => ({
    path: "/home/",
  }),
  methods: {
    setFolderPath(path) {
      this.question.answer = path;
      this.$emit("answerChanged", this.question.name, path);
    },
    onSelectFolder() {
      this.$emit("customEvent", this.question.name, "getPath", this.setFolderPath, this.question.answer);
    },
    onAnswerChanged(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer.target.value);
      }
    },
  },
};
</script>
<style scoped>
vscode-textfield {
  padding-inline-end: 11px;
}
</style>
