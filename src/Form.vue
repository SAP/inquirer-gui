<template>
  <v-form class="inquirer-gui">
    <template v-for="(question, index) in questions">
      <p
        :key="'label-' + index"
        class="question-label"
        v-if="question.shouldShow"
      >{{question._message}}</p>
      <component
        v-if="question.shouldShow"
        :is="getComponentByQuestionType(question.type)"
        :key="index"
        :question="question"
        @answerChanged="onAnswerChanged"
        @customEvent="onCustomEvent"
      ></component>
    </template>
  </v-form>
</template>

<script>
import Plugins from "./Plugins";

export default {
  name: "Form",
  props: {
    questions: Array
  },
  data() {
    return {
      plugins: Plugins.registerBuiltinPlugins()
    };
  },
  methods: {
    getComponentByQuestionType(questionType) {
      const foundPlugin = this.plugins.find(plugin => {
        return plugin.questionType === questionType;
      });
      if (foundPlugin) {
        return foundPlugin.component;
      }
    },
    registerPlugin(plugin) {
      this.plugins.push(plugin);
    },
    getAnswers() {
      let result = {};
      for (let question of this.questions) {
        result[question.name] = question.answer;
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
    getInitialAnswer(question) {
      let answer;
      switch (question.type) {
        case "input":
        case "password":
        case "editor":
          answer = question._default;
          if (answer === undefined) {
            answer = "";
          }
          return answer;
        case "number":
          answer = question._default;
          if (answer === undefined) {
            answer = 0;
          }
          return answer;
        case "list":
        case "rawlist":
        case "expand":
        case "checkbox":
          if (!Array.isArray(question._choices)) {
            return;
          }
          // handle complex choice cases below
          break;
        default:
          return question._default;
      }

      // handle complex choice cases
      let index = -1;
      switch (question.type) {
        case "list":
        case "rawlist":
          if (question._choices.length === 0) {
            return;
          }
          if (typeof question._default === "number") {
            index = question._default;
          } else {
            index = question._choices.findIndex(choice => {
              if (question._default) {
                return choice.value === question._default.value;
              }
            });
          }
          if (index < 0 || index > question._choices.length - 1) {
            index = 0;
          }
          return question._choices[index].value;
        case "expand":
          if (question._choices.length === 0) {
            return;
          }
          if (typeof question._default === "number") {
            index = question._default;
          }
          if (index < 0 || index > question._choices.length - 1) {
            index = 0;
          }
          return question._choices[index].value;
        case "checkbox":
          const initialAnswersArray = [];
          for (let choice of question._choices) {
            // add to answers if choice is in default
            if (Array.isArray(question._default)) {
              let foundIndex = question._default.findIndex(
                currentDefaultValue => {
                  return choice.value === currentDefaultValue;
                }
              );
              if (foundIndex >= 0) {
                initialAnswersArray.push(choice.value);
              }
            }

            // add to answers if choice is marked as checked
            if (choice.checked === true) {
              initialAnswersArray.push(choice.value);
            }
          }

          // add first choice to answers if there are no other defaults
          if (
            initialAnswersArray.length === 0 &&
            question._choices.length > 0
          ) {
            initialAnswersArray.push(question._choices[0].value);
          }

          return initialAnswersArray;
      }
    },
    async onCustomEvent(questionName, methodName, callback, ...params) {
      const relevantQuestion = this.questions.find(value => {
        return value["name"] === questionName;
      });

      if (typeof relevantQuestion[methodName] === "function") {
        let response = await relevantQuestion[methodName](params);
        if (callback) {
          callback(response);
        }
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

      const answers = this.getAnswers();
      // evaluate answers for all questions (e.g. when)
      for (let question of this.questions) {
        if (question.name !== answeredQuestion.name) {
          // evaluate when()
          if (typeof question.when === "function") {
            let response = await question.when(answers);
            question.shouldShow = response;
          }

          // evaluate message()
          if (typeof question.message === "function") {
            let response = await question.message(answers);
            question._message = response;
          }

          // evaluate choices()
          if (typeof question.choices === "function") {
            const response = await question.choices(answers);
            question._choices = this.normalizeChoices(response);
            question.answer = this.getInitialAnswer(question);
            // optimization: avoid repeatedly calling this.getAnswers()
            answers[question.name] = question.answer;
          }

          // evaluate default()
          if (typeof question.default === "function" && !question.isDirty) {
            question._default = await question.default(answers);
            question.answer = this.getInitialAnswer(question);
            // optimization: avoid repeatedly calling this.getAnswers()
            answers[question.name] = question.answer;
          }
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
      // 1st pass: set initial values
      for (let question of this.questions) {
        // message
        const message =
          typeof question.message === "string"
            ? question.message
            : question.name;
        this.$set(question, "_message", message);

        // choices
        if (question.choices) {
          let choices = [];
          if (typeof question.choices !== "function") {
            choices = this.normalizeChoices(question.choices);
          }
          this.$set(question, "_choices", choices);
        }

        // default
        if (question.default) {
          let _default;
          if (typeof question.default !== "function") {
            _default = question.default;
          }
          this.$set(question, "_default", _default);
        }

        // answer
        let answer = this.getInitialAnswer(question);
        this.$set(question, "answer", answer);

        // visibility
        const shouldShow = question.when === false ? false : true;
        this.$set(question, "shouldShow", shouldShow);

        // validity
        this.$set(question, "isValid", true);
        this.$set(question, "validationMessage", "");

        // dirty
        this.$set(question, "isDirty", false);
      }

      const answers = this.getAnswers();
      // 2nd pass: evaluate properties that are functions
      for (let question of this.questions) {
        // evaluate message()
        if (typeof question.message === "function") {
          const response = await question.message(answers);
          question._message = response;
        }

        // evaluate choices()
        if (typeof question.choices === "function") {
          const response = await question.choices(answers);
          question._choices = this.normalizeChoices(response);
          question.answer = this.getInitialAnswer(question);
          // optimization: avoid repeatedly calling this.getAnswers()
          answers[question.name] = question.answer;
        }

        // evaluate default()
        if (typeof question.default === "function") {
          question._default = await question.default(answers);
          question.answer = this.getInitialAnswer(question);
          // optimization: avoid repeatedly calling this.getAnswers()
          answers[question.name] = question.answer;
        }
      }

      // TODO: set defaults for choice functions after they were evaluated?
    }
  }
};
</script>

<style>
.inquirer-gui p.question-label {
  margin-top: 0.25rem;
  margin-bottom: 0.05rem;
}

.inquirer-gui .v-text-field div.v-text-field__details {
  margin-bottom: 2px;
}

.inquirer-gui .v-text-field input {
  padding: 0px;
}
</style>
