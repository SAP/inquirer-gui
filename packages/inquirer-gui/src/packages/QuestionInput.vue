<template>
  <vscode-textfield
    @input="onInput"
    :name="question.name"
    :value="question.answer"
    :type="getInputType(question.type)"
    :placeholder="question.placeholder"
  ></vscode-textfield>
</template>

<script>
export default {
  name: "QuestionInput",
  props: {
    question: Object,
  },
  methods: {
    onInput(val) {
      this.$emit("answerChanged", this.question.name, val.target.value);
    },
    getInputType(questionType) {
      switch (questionType) {
        case "password":
          return "password";
        case "number":
          return "number";
        case "input":
          return "text";
      }
    },
  },
};
</script>

<style>
.v-input {
  margin: 0;
  padding: 0px;
}

.col {
  padding-bottom: 0px;
}

vscode-textfield {
  width: 100%;
  min-height: 40px;
  --vscode-font-size: 16px;
}
</style>
