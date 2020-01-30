<template>
  <div id="QuestionTypeSelector" v-if="question.shouldShow">
    <QuestionInput
      v-if="!question.type || question.type==='input' || question.type==='password' || question.type==='number'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />

    <QuestionEditor
      v-if="question.type==='editor'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />

    <QuestionList
      v-if="question.type==='list' || question.type==='rawlist'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />

    <QuestionConfirm
      v-if="question.type==='confirm'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />

    <QuestionCheckbox
      v-if="question.type==='checkbox'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />

    <QuestionExpand
      v-if="question.type==='expand'"
      :question="question"
      @answerChanged="onAnswerChanged"
    />
  </div>
</template>

<script>
import QuestionList from "./QuestionTypes/QuestionList";
import QuestionInput from "./QuestionTypes/QuestionInput";
import QuestionEditor from "./QuestionTypes/QuestionEditor";
import QuestionConfirm from "./QuestionTypes/QuestionConfirm";
import QuestionCheckbox from "./QuestionTypes/QuestionCheckbox";
import QuestionExpand from "./QuestionTypes/QuestionExpand";

export default {
  name: "QuestionTypeSelector",
  components: {
    QuestionList,
    QuestionInput,
    QuestionEditor,
    QuestionConfirm,
    QuestionCheckbox,
    QuestionExpand
  },
  props: {
    question: Object
  },
  data() {
    return {
      selectedIndex: null,
      correctIndex: null,
      shuffledAnswers: []
    };
  },
  methods: {
    onAnswerChanged(name, answer) {
      this.$emit("answerChanged", name, answer);
    }
  }
};
</script>
