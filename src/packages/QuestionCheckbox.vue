<template>
<v-card>
  <v-list>
    <v-list-item-group
      multiple
      ref="itemsGroup"
      v-model="options"
      @change="onAnswerChanged"
      :error-messages="question.validationMessage"
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
              <v-list-item-action>
                <v-checkbox
                  dense
                  :input-value="active"
                  :true-value="item.value"
                  @click="toggle"
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
// TODO: Support separators
export default {
  name: "QuestionCheckbox",
  props: {
    question: Object
  },
  data() {
    return {
      // TODO: doesn't work if default is a function 
      options: this.question.answer
    };
  },
  methods: {
    onAnswerChanged() {
      this.$emit("answerChanged", this.question.name, this.$refs.itemsGroup.selectedValues);
    }
  }
};
</script>

<style>
.v-messages {
  min-height: 0px;
}
</style>