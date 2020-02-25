<template>
<v-card>
  <v-list>
    <v-list-item-group
      ref="itemsGroup"
      :value="question.answer"
      @change="onAnswerChanged"
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
          <template v-slot:default="{ active, toggle }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </template>
    </v-list-item-group>
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
      this.$emit("answerChanged", this.question.name, value);
    }
  }
};
</script>

<style>
.v-messages {
  min-height: 0px;
}
</style>