<template>
  <div class="label">
    <span class="question-answer" v-html="question.answer"></span>
  </div>
</template>

<script>
export default {
  name: "QuestionLabel",
  props: {
    question: Object
  }
};
</script>

<style>
.col {
  padding-bottom: 0px;
}
</style>