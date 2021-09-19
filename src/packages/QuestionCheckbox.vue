<template>
<v-card
  outlined
  tile
  id="question-checkbox-v-card"
>
  <v-list
    dense
    subheader
    max-height=60vh
    class="overflow-y-auto"
    id="question-checkbox-v-list"
  >
    <v-list-item-group
      multiple
      ref="itemsGroup"
      :value="question.answer"
      @change="onAnswerChanged"
      id="question-checkbox-v-list-item-group"
    >
      <template v-for="(item, i) in question._choices">
        <v-divider
            v-if="item.type === 'separator'"
            :key="`divider-${i}`"
            id="question-checkbox-v-divider"
          ></v-divider>
        <v-list-item
            v-else
            :key="`item-${i}`"
            :value="item.value"
            id="question-checkbox-v-list-item"
        >
          <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox
                  dense
                  :input-value="active"
                  :true-value="item.value"
                  id="question-checkbox-v-list-item-action-checkbox"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title 
                  v-text="item.name">
                  id="question-checkbox-v-list-item-title"
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </template>
    </v-list-item-group>
  </v-list>
</v-card>

</template>

<script>
export default {
  name: "QuestionCheckbox",
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