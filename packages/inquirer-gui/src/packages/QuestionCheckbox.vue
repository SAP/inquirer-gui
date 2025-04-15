<template>
  <v-card id="question-checkbox-v-card" variant="text" :rounded="0">
    <v-list
      density="compact"
      active-class="nobg"
      max-height="60vh"
      class="overflow-y-auto v-list--subheader"
      id="question-checkbox-v-list"
      select-strategy="classic"
      :selected="question.answer"
      @update:selected="onAnswerChanged"
    >
      <template v-for="(item, i) in question._choices">
        <v-divider v-if="item.type === 'separator'" :key="`divider-${i}`" id="question-checkbox-v-divider"></v-divider>
        <v-list-item v-else :key="`item-${i}`" :value="item.value" id="question-checkbox-v-list-item">
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isActive" color="primary"></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "QuestionCheckbox",
  props: {
    question: Object,
  },
  methods: {
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    },
  },
};
</script>

<style>
.v-messages {
  min-height: 0px;
}
div#question-checkbox-v-card {
  border: none !important;
}
div#question-checkbox-v-list-item {
  padding-left: 0 !important;
  --v-hover-opacity: 0 !important;
}
form.inquirer-gui div.v-list,
div[role="listbox"].v-theme--light.v-list {
  background-color: var(--vscode-editor-background, var(--v-theme-background), #1f1f1f) !important;
}
.nobg,
div.v-list-item--active {
  background-color: var(--vscode-editor-background, var(--v-theme-background), #1f1f1f) !important;
  --v-activated-opacity: 0 !important;
  --v-hover-opacity: 0 !important;
}
div.v-list-item__spacer {
  display: none !important;
}
div.v-list-item-action.v-list-item-action--start {
  margin-right: 0 !important;
}
</style>
