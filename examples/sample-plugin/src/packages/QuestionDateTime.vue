<template>
  <v-menu :close-on-content-click="false" transition="scale-transition" min-width="290px">
    <template v-slot:activator="{ props }">
      <v-text-field
        :modelValue="date"
        prepend-icon="event"
        readonly
        v-bind="props"
        hide-details="auto"
        variant="outlined"
        density="compact"
      ></v-text-field>
    </template>
    <v-date-picker :modelValue="date" @update:modelValue="onInput"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "QuestionDateTime",
  props: {
    question: Object,
  },
  data: () => ({
    date: new Date().toISOString().substring(0, 10),
  }),
  methods: {
    onInput(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    },
  },
};
</script>
