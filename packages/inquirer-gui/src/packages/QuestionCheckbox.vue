<template>
  <v-card
    id="question-checkbox-v-card"
    variant="outlined"
    :rounded="0"
    :class="{ 'single-choice': question._choices.length === 1 }"
  >
    <v-list
      density="compact"
      max-height="60vh"
      :class="
        question._choices.length === 1
          ? 'list-single overflow-y-auto v-list--subheader'
          : 'overflow-y-auto v-list--subheader'
      "
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
div#question-checkbox-v-card.single-choice {
  border: none;
}
.list-single > div#question-checkbox-v-list-item {
  padding-left: 0;
  --v-hover-opacity: 0;
}
form.inquirer-gui > .single-choice > div.v-list,
.single-choice > div[role="listbox"].v-theme--light.v-list {
  background-color: var(--vscode-editor-background, var(--v-theme-background), #1f1f1f);
}
.list-single > div.v-list-item--active {
  background-color: var(--vscode-editor-background, var(--v-theme-background), #1f1f1f);
  --v-activated-opacity: 0;
  --v-hover-opacity: 0;
}
.single-choice > div.v-list-item__spacer {
  display: none;
}
div.v-list-item-action.v-list-item-action--start {
  margin: 0;
}
</style>
