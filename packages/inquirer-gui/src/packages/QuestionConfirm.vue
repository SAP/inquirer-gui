<template>
  <vscode-radio-group @change="onClick">
    <vscode-radio
      :name="question.name"
      :label="question.labelTrue || 'Yes'"
      :value="true"
      :checked="isChecked(true)"
      :class="{ 'checked-radio': isChecked(true) }"
    ></vscode-radio>
    <vscode-radio
      :name="question.name"
      :label="question.labelFalse || 'No'"
      :value="false"
      :checked="isChecked(false)"
      :class="{ 'checked-radio': isChecked(false) }"
    ></vscode-radio>
  </vscode-radio-group>
</template>

<script>
export default {
  name: "QuestionConfirm",
  props: {
    question: Object,
  },
  methods: {
    onClick(answer) {
      this.$emit("answerChanged", this.question.name, answer.target.value);
    },
    isChecked(value) {
      return this.question.answer ? this.question.answer === value : this.question.default === value;
    },
  },
};
</script>

<style scoped>
vscode-radio {
  margin-right: 20px;
  --vscode-font-size: 16px;
  --vscode-settings-checkboxForeground: var(--vscode-focusBorder, #1976d2);
  --vscode-settings-checkboxBackground: transparent;
}
vscode-radio-group {
  margin-left: 5px;
}
vscode-radio.checked-radio {
  --vscode-settings-checkboxBorder: var(--vscode-focusBorder, #1976d2);
}
</style>
