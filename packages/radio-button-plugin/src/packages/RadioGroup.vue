<template>
  <div class="radio" v-if="isVisible()">
    <v-radio-group
      style="margin-bottom: 0pt; padding-bottom: 0pt"
      @update:modelValue="onClick"
      :modelValue="question.answer"
      inline
      density="compact"
    >
      <v-radio
        class="radioClass"
        v-for="item in question.choices"
        :key="item"
        :label="item"
        :value="item"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "RadioGroup",
  props: {
    question: Object,
  },
  methods: {
    getRadioId(name) {
      return `radio_${name}`;
    },
    onClick(answer) {
      if (answer) {
        this.$emit("answerChanged", this.question.name, answer);
      }
    },
    isVisible() {
      return this.hasItem() && this.question.visible !== false;
    },
    hasItem() {
      return this.question.choices.length > 0;
    },
  },
};
</script>
<style>
.radioClass :deep(label) {
  font-size: 13px;
  font-weight: 400;
}
</style>
