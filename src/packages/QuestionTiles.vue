<template>
  <div>
  <v-card
    v-for="(item, index) in question._choices"
    :key="index"
    outlined
  >
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="headline mb-1">{{ item.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
    
  </v-card>
  </div>
</template>

<script>
export default {
  name: "QuestionTiles",
  methods: {
    onAnswerChanged(value) {
      this.$emit("answerChanged", this.question.name, value);
    }
  },
  data() {
    return {
      clickToDisplay: "Click to display the list of options"
    }
  },
  props: {
    question: Object
  }
};
</script>

<style scoped>
.list-group {
  margin-bottom: 15px;
}
.list-group-item:hover {
  cursor: pointer;
}
</style>
