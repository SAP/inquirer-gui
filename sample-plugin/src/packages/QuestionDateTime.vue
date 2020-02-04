<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        prepend-icon="event"
        readonly
        v-on="on"
        hide-details="auto"
        outlined
        dense
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" @input="onInput"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: "QuestionDateTime",
  props: {
    question: Object
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10)
  }),
  methods: {
    onInput(answer) {
      if (answer !== undefined) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    }
  }
};
</script>
