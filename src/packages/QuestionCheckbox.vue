<template>
<v-card
  outlined
  tile
>
  <v-list
    dense
    subheader
  >
    <v-list-item-group
      multiple
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
          <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-checkbox
                  dense
                  :input-value="active"
                  :true-value="item.value"
                ></v-checkbox>
              </v-list-item-action>
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