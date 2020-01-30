<template>
  <div class="inquirer-gui">
    <v-form>
      <QuestionTypeSelector
        v-for="(item, index) in questions"
        :key="index"
        :question="item"
        @answerChanged="onAnswerChanged"
      />
    </v-form>
  </div>
</template>

<script>
import QuestionTypeSelector from "./components/QuestionTypeSelector.vue";
export default {
  name: "Form",
  components: {
    QuestionTypeSelector
  },
  props: {
    questions: Array
  },
  methods: {
    getAnswers() {
      let result = {};
      for (let question of this.questions) {
        if (question._choices && question.answer && question.answer.value) {
          // Vuetify returns objects instead of values for comboboxes: https://github.com/vuetifyjs/vuetify/issues/5479
          result[question.name] = question.answer.value;
        } else {
          result[question.name] = question.answer;
        }
      }
      return result;
    },
    normalizeChoices(choices) {
      if (Array.isArray(choices)) {
        const mappedChoices = choices.map(value => {
          if (typeof value === "string" || typeof value === "number") {
            return { name: value, value: value, short: value };
          }
          return value;
        });
        return mappedChoices;
      }
    },
    async onAnswerChanged(name, answer) {
      const answeredQuestion = this.questions.find(value => {
        return value["name"] === name;
      });
      if (answeredQuestion) {
        answeredQuestion.isDirty = true;
        // evaluate validate()
        if (answeredQuestion.validate) {
          const answers = this.getAnswers();
          let response = await answeredQuestion.validate(answer, answers);
          answeredQuestion.isValid = response !== true ? false : true;
          answeredQuestion.validationMessage =
            typeof response === "string" ? response : "";
        }
        // TODO: if input is invalid, should we update the answer?
        // set the answer
        answeredQuestion["answer"] = answer;
      }

      // evaluate answers for all questions (e.g. when)
      const answers = this.getAnswers();
      for (let question of this.questions) {
        if (question.name !== answeredQuestion.name) {
          // evaluate when()
          if (typeof question.when === "function") {
            let response = await question.when(answers);
            question.shouldShow = response;
          }

          // evaluate default()
          if (typeof question.message === "function") {
            let response = await question.message(answers);
            question._message = response;
          }

          if (typeof question.default === "function" && !question.isDirty) {
            const response = await question.default(answers);
            // TODO: perform transformation when needed (indexes for lists, etc.)
            question.answer = response;
            answers[question.name] = response;
          }

          // TODO: evaluate choices if defined as a function
        }
      }

      const allValid = !this.questions.some(question => {
        return question.isValid === false;
      });

      // apply filters
      let filteredAnswers = {};
      Object.assign(filteredAnswers, answers);
      for (let question of this.questions) {
        if (question.filter) {
          const currentAnswer = answers[question.name];
          const filteredAnswer = await question.filter(currentAnswer);
          filteredAnswers[question.name] = filteredAnswer;
        }
      }

      // fire 'answered' event
      this.$emit("answered", filteredAnswers, allValid);
    }
  },
  watch: {
    questions: async function() {
      // set initial values for properties
      for (let question of this.questions) {
        const answer =
          typeof question.default === "string" ? question.default : undefined;
        this.$set(question, "answer", answer);
        const message =
          typeof question.message === "string" ? question.message : "";
        this.$set(question, "_message", message);
        if (question.choices) {
          this.$set(
            question,
            "_choices",
            this.normalizeChoices(question.choices)
          );
        }
        const shouldShow = question.when === false ? false : true;
        this.$set(question, "shouldShow", shouldShow);
        this.$set(question, "isValid", true);
        this.$set(question, "isDirty", false);
        this.$set(question, "validationMessage", "");
      }

      for (let question of this.questions) {
        // evaluate default values that are functions
        const answers = this.getAnswers();
        if (typeof question.default === "function") {
          const response = await question.default(answers);
          // TODO: perform transformation when needed (indexes for lists, etc.)
          question.answer = response;
        }
        if (typeof question.message === "function") {
          const response = await question.message(answers);
          question._message = response;
        }
      }
    }
  }
};
</script>

<style >
.inquirer-gui p.question-label {
  margin-bottom: 0.25rem;
}

.inquirer-gui .v-text-field input {
  padding: 0px;
}
</style>
