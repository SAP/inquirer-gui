<template>
  <div id="QuestionTypeSelector" v-if="currentQuestion.shouldShow">
    <QuestionInput
      v-if="!currentQuestion.type || currentQuestion.type==='input' || currentQuestion.type==='password' || currentQuestion.type==='number'"
      :currentQuestion="currentQuestion"
      @answerChanged="onAnswerChanged"
    />

    <QuestionEditor
      v-if="currentQuestion.type==='editor'"
      :currentQuestion="currentQuestion"
      @answerChanged="onAnswerChanged"
    />

    <QuestionList
      v-if="currentQuestion.type==='list' || currentQuestion.type==='rawlist'"
      :currentQuestion="currentQuestion"
      @answerChanged="onAnswerChanged"
    />

    <QuestionConfirm
      v-if="currentQuestion.type==='confirm'"
      :currentQuestion="currentQuestion"
      @answerChanged="onAnswerChanged"
    />

    <QuestionCheckbox
      v-if="currentQuestion.type==='checkbox'"
      :currentQuestion="currentQuestion"
      @answerChanged="onAnswerChanged"
    />

    <QuestionExpand
      v-if="currentQuestion.type==='expand'"
      :currentQuestion="currentQuestion"
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
    currentQuestion: Object
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
