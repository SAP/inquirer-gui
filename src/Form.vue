<template>
  <div class="inquirer-gui">
    <v-form>
      <QuestionTypeSelector
        v-for="(item, index) in questions"
        :key="index"
        :currentQuestion="item"
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
  data() {
    return {
      allValid: true
    };
  },
  props: {
    questions: Array
  },
  methods: {
    getAnswers() {
      let result = {};
      for (let question of this.questions) {
        if (question._choices && question.answer.value) {
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
      if (name !== undefined) {
        const question = this.questions.find(value => {
          return value["name"] === name;
        });
        if (question) {
          // evaluate validate()
          if (question.validate) {
            const answers = this.getAnswers();
            let response = await question.validate(answer, answers);
            question.isValid = response !== true ? false : true;
            question.validationMessage =
              typeof response === "string" ? response : "";
          }
          // TODO: if input is invalid, should we update the answer?

          let filteredAnswer = answer;
          if (question.filter) {
            filteredAnswer = await question.filter(answer);
          }

          // set the answer
          question["answer"] = filteredAnswer;
        }
      }

      // evaluate answers for all questions (e.g. when)
      const answers = this.getAnswers();
      for (let question of this.questions) {
        // evaluate when()
        if (question.when) {
          if (typeof question.when === "function") {
            let response = await question.when(answers);
            question.shouldShow = response;
          } else if (typeof question.when === "boolean") {
            question.shouldShow = question.when;
          }
        }
      }

      // fire 'answered' event
      this.allValid = !this.questions.some(question => {
        return question.isValid === false;
      });
      this.$emit("answered", answers, this.allValid);
    }
  },
  watch: {
    questions: async function() {
      // set initial values for properties
      for (let question of this.questions) {
        this.$set(question, "answer", undefined);
        this.$set(question, "_message", "");
        if (question.choices) {
          this.$set(
            question,
            "_choices",
            this.normalizeChoices(question.choices)
          );
        }
        this.$set(question, "shouldShow", true);
        this.$set(question, "isValid", true);
        this.$set(question, "validationMessage", "");
        if (typeof question.default !== "function") {
          // TODO: perform transformation when needed (indexes for lists, etc.)
          question.answer = question.default;
        }
        if (typeof question.message !== "function") {
          question._message = question.message;
        }
      }

      for (let question of this.questions) {
        // evaluate default values that are functions
        const answers = this.getAnswers();
        if (typeof question.default === "function") {
          const response = await question.default(answers);
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
