<template>
  <v-card
    variant="outlined"
  >
    <v-list
      density="compact"
      :selected="[question.answer]"
      @update:selected="onAnswerChanged"
      class="v-list--subheader"
    >
        <template v-for="(item, i) in question._choices">
          <v-divider
              v-if="item.type === 'separator'"
              :key="`divider-${i}`"
            ></v-divider>
          <v-list-item
              v-else
              :key="`item-${i}`"
              :value="item.value"
          >
          <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item>
          </template>
    </v-list>
  </v-card>
  
  </template>
  
  <script>
  // TODO: Support separators
  export default {
    name: "QuestionExpand",
    props: {
      question: Object
    },
    methods: {
      onAnswerChanged(value) {
        this.$emit("answerChanged", this.question.name, value[0]);
      }
    }
  };
  </script>
  
  <style>
  .v-messages {
    min-height: 0px;
  }
  </style>