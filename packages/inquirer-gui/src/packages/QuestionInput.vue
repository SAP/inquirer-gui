<template>
  <vscode-textfield
    @input="onInput"
    :name="question.name"
    :value="question.answer"
    :type="getInputType(question.type)"
    :placeholder="question.placeholder"
  ></vscode-textfield>
</template>

<script>
// @vscode-elements/elements@1.11.0 hardcodes line-height: 18px on the inner
// <input> with no CSS custom property hook. Remove this patch when the library
// exposes one (e.g. --vscode-input-line-height).
function applyPatch(el) {
  if (el && el.shadowRoot && !el.shadowRoot.querySelector("style.line-height-patch")) {
    const style = document.createElement("style");
    style.className = "line-height-patch";
    style.textContent = "input { line-height: normal !important; }";
    el.shadowRoot.appendChild(style);
  }
}

export default {
  name: "QuestionInput",
  props: {
    question: Object,
  },
  mounted() {
    const el = this.$el;
    if (el && typeof el.updateComplete !== "undefined") {
      el.updateComplete.then(() => applyPatch(el));
    } else {
      applyPatch(el); // fallback for non-Lit environments; usually a no-op in tests
    }
  },
  methods: {
    onInput(val) {
      this.$emit("answerChanged", this.question.name, val.target.value);
    },
    getInputType(questionType) {
      switch (questionType) {
        case "password":
          return "password";
        case "number":
          return "number";
        case "input":
          return "text";
      }
    },
  },
};
</script>

<style>
.v-input {
  margin: 0;
  padding: 0px;
}

.col {
  padding-bottom: 0px;
}

vscode-textfield {
  width: 100%;
  min-height: 40px;
  --vscode-font-size: 16px;
}
</style>
