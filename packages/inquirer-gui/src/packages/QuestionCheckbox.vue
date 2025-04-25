<template>
  <v-card id="question-checkbox-v-card" variant="outlined" :rounded="0">
    <v-list
      density="compact"
      max-height="60vh"
      class="overflow-y-auto v-list--subheader"
      id="question-checkbox-v-list"
      select-strategy="classic"
      :selected="question.answer"
      @update:selected="onAnswerChanged"
    >
      <template v-for="(item, i) in question._choices">
        <vscode-divider
          v-if="item.type === 'separator'"
          :key="`divider-${i}`"
          id="question-checkbox-v-divider"
        ></vscode-divider>
        <v-list-item v-else :key="`item-${i}`" :value="item.value" id="question-checkbox-v-list-item">
          <template v-slot:prepend="{ isActive }">
            <v-list-item-action start>
              <vscode-checkbox
                :class="{ 'checked-item': isActive }"
                :value="isActive"
                :checked="isActive"
                color="primary"
              ></vscode-checkbox>
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

<style scoped>
.v-messages {
  min-height: 0px;
}
::v-deep(.v-list-item__overlay) {
  opacity: 0 !important;
}
.checked-item {
  --vscode-settings-checkboxBackground: var(--vscode-focusBorder, #1976d2);
  --vscode-settings-checkboxBorder: transpared;
  --vscode-settings-checkboxForeground: white;
}
</style>
