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
      applyPatch(el);
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
