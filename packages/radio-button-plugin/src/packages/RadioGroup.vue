<template>
  <vscode-radio-group
    v-if="isVisible()"
    style="margin-bottom: 0pt; padding-bottom: 0pt"
    :variant="question.orientation === 'vertical' ? 'vertical' : 'horizontal'"
    @change="onClick"
    :value="question.answer"
  >
    <vscode-radio
      class="radioClass"
      v-for="(item, index) in convertChoices(question.choices)"
      :class="{ 'checked-radio': isChecked(item.value) }"
      :id="`${item.value}-${index}`"
      :name="question.name"
      :checked="isChecked(item.value)"
      :key="item.value"
      :label="item.value"
      :value="item.value"
      :disabled="item.disabled"
    >
    </vscode-radio>
  </vscode-radio-group>
</template>

<script>
export default {
  name: "RadioGroup",
  props: {
    question: Object,
    answers: Object,
  },
  data() {
    return {
      defaultValue: null,
    };
  },
  async mounted() {
    // Await default value if it's a function that returns a promise
    if (typeof this.question.default === "function") {
      const result = this.question.default(this.answers);
      this.defaultValue = result instanceof Promise ? await result : result;
    } else {
      this.defaultValue = this.question.default;
    }
    // If no answer or default, auto-select the first non-disabled option
    if (!this.question.answer && this.defaultValue == null) {
      const firstAvailable = this.convertChoices(this.question.choices)?.find((item) => !item.disabled);
      if (firstAvailable) {
        this.$emit("answerChanged", this.question.name, firstAvailable.value);
      }
    }
  },
  methods: {
    getRadioId(name) {
      return `radio_${name}`;
    },
    isChecked(value) {
      return this.question.answer != null ? this.question.answer === value : this.defaultValue === value;
    },
    onClick(answer) {
      if (answer) {
        this.$emit("answerChanged", this.question.name, answer.target.value);
      }
    },
    isVisible() {
      return this.hasItem() && this.question.visible !== false;
    },
    hasItem() {
      return this.question.choices && this.question.choices.length > 0;
    },
    convertChoices(choices) {
      return choices?.map((item) => {
        if (typeof item === "string") {
          return { value: item };
        }
        return item;
      });
    },
  },
};
</script>
<style scoped>
vscode-radio {
  margin-right: 20px !important; /* necessary due to the vuetify *{pading: 0; margin: 0} */
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
