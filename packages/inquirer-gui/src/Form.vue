<template>
  <v-form class="inquirer-gui" @submit.prevent>
    <template v-for="(question, index) in questions" :key="question.name">
      <p :key="'label-' + index" class="question-label" v-if="question.shouldShow">
        <span class="question-message">{{ question._message }}</span>
        <span class="question-hint" v-if="question.guiOptions && question.guiOptions.hint">
          <v-tooltip location="top" max-width="350px">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props">mdi-help-circle-outline</v-icon>
            </template>
            <span>{{ question.guiOptions.hint }}</span>
          </v-tooltip>
        </span>
        <span class="mandatory-asterisk" v-if="question.isMandatory">*</span>
        <span class="question-link" v-if="question.guiOptions && question.guiOptions.link">
          <a
            v-if="question.guiOptions.link.command"
            :command="question.guiOptions.link.command.id"
            :params="question.guiOptions.link.command.params"
            @click="executeCommand"
            >{{ question.guiOptions.link.text }}</a
          >
          <a v-else-if="question.guiOptions.link.url" target="_blank" :href="question.guiOptions.link.url">{{
            question.guiOptions.link.text
          }}</a>
        </span>
      </p>
      <component
        v-if="question.shouldShow"
        :is="getComponentByQuestionType(question)"
        :key="index"
        :question="question"
        :answers="getAnswers()"
        @answerChanged="onAnswerChanged"
        @customEvent="onCustomEvent"
        @setBusyIndicator="setBusyIndicator"
      ></component>
      <div
        v-if="shouldShowValidationMessage(question)"
        class="validation-messages"
        :key="'validation-' + index"
        :id="'validation-msg-' + index"
      >
        <span class="error-validation-text">{{ question.validationMessage }}</span>
        <span class="question-link" v-if="question.validationLink">
          <a v-if="question.validationLink.command" @click="executeCommand(question.validationLink.command)">
            <img
              class="validation-link-icon"
              v-if="question.validationLink.icon"
              :src="question.validationLink.icon"
            /><span v-text="question.validationLink.text" id="cmdLinkText"></span>
          </a>
          <a v-else-if="question.validationLink.url" target="_blank" :href="question.validationLink.url">
            <img
              class="validation-link-icon"
              v-if="question.validationLink.icon"
              :src="question.validationLink.icon"
            /><span v-text="question.validationLink.text" id="urlLinkText"></span>
          </a>
        </span>
      </div>
      <div
        v-else-if="shouldShowAdditionalMessages(question)"
        class="add-messages"
        :key="'additional-msg-' + index"
        :id="'add-msg-' + index"
      >
        <v-icon class="messages-icon" :class="severityMessageClass(question._additionalMessages.severity)"
          >mdi-{{ severityIcon(question._additionalMessages.severity) }}</v-icon
        ><span class="messages-text" :class="severityMessageClass(question._additionalMessages.severity)">{{
          question._additionalMessages.message
        }}</span>
      </div>
    </template>
  </v-form>
</template>

<script>
import { markRaw } from "vue";
import Plugins from "./Plugins";
import isEqual from "lodash/isEqual";

const NOT_ANSWERED = "Mandatory field";
const MANDATORY_TYPES = ["list", "rawlist", "expand", "autocomplete"];
const Severity = {
  error: 0,
  warning: 1,
  information: 2,
};

export default {
  // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
  name: "Form",
  props: {
    questions: Array,
  },
  data() {
    return {
      plugins: null,
      severityClass: {
        [Severity.warning]: "severity-warn",
        [Severity.information]: "severity-info",
        [Severity.error]: "severity-error",
      },
      severityIconName: {
        [Severity.warning]: "alert-outline",
        [Severity.information]: "information-outline",
        [Severity.error]: "close-circle-outline",
      },
    };
  },
  computed: {
    console: () => console,
  },
  methods: {
    severityMessageClass(severity) {
      return this.severityClass[severity];
    },
    severityIcon(severity) {
      return this.severityIconName[severity];
    },
    setBusyIndicator(isBusy) {
      this.$emit("setBusyIndicator", isBusy);
    },
    // Execute a command embedded in an event or directly as { id: <commandIdString>, params: <paramObject> }
    executeCommand(cmdOrEvent) {
      this.$emit("parentExecuteCommand", cmdOrEvent);
    },
    shouldShowAdditionalMessages(question) {
      return question.shouldShow && question._additionalMessages && question._additionalMessages.message;
    },
    shouldShowValidationMessage(question) {
      return (
        question.shouldShow &&
        !question.isValid &&
        (question.__origAnswer !== undefined || !(question.guiOptions && question.guiOptions.hint && !question.isDirty))
      );
    },
    removeShouldntShows(questions, answers) {
      for (let question of this.questions) {
        // remove answers to questions whose when() evaluated to false
        if (!question.shouldShow) {
          delete answers[question.name];
        }
      }
    },
    async doValidate(question, answer) {
      // evaluate validate()
      try {
        if (typeof question.validate === "function") {
          const answers = this.getAnswers();
          const response = await question.validate(answer, answers);
          if (response === true) {
            this.setValid(question);
          } else if (response === false) {
            this.setInvalid(question);
          } else if (
            // eslint-disable-next-line no-prototype-builtins
            response?.hasOwnProperty("link") &&
            // eslint-disable-next-line no-prototype-builtins
            response.hasOwnProperty("message")
          ) {
            // Validation messages with links
            this.setInvalidWithLink(question, response);
          } else if (response) {
            this.setInvalid(question, response);
          } else {
            this.setValid(question);
          }
        } else if (MANDATORY_TYPES.includes(question.type) && answer === undefined) {
          this.setInvalid(question);
        } else {
          this.setValid(question);
        }
      } catch (e) {
        const errorMessage = `Could not evaluate validate() for ${question.name}. ${e.message}`;
        this.console.error(errorMessage);
        this.setInvalid(question, errorMessage);
      }
    },
    setInvalidWithLink(question, linkMsg = { message: "", link: {} }) {
      question.isValid = false;
      question.validationMessage = linkMsg.message;
      question.validationLink = linkMsg.link;
    },
    setInvalid(question, message = NOT_ANSWERED) {
      question.isValid = false;
      question.validationLink = undefined; // Ensure existing validation link is removed
      question.validationMessage = message;
    },
    setValid(question) {
      question.isValid = true;
      question.validationMessage = "";
    },
    setIsMandatory(question) {
      question.isMandatory =
        MANDATORY_TYPES.includes(question.type) ||
        (question.guiOptions && question.guiOptions.mandatory === true && typeof question.validate === "function");
    },
    getComponentByQuestionType(question) {
      const guiType = question.guiOptions && question.guiOptions.type ? question.guiOptions.type : question.guiType;
      let foundPlugin;
      if (guiType) {
        foundPlugin = this.plugins.find((plugin) => {
          return plugin.questionType === guiType;
        });
        if (foundPlugin) {
          return foundPlugin.component;
        }
      }
      foundPlugin = this.plugins.find((plugin) => {
        return plugin.questionType === question.type;
      });
      if (foundPlugin) {
        return foundPlugin.component;
      }
    },
    registerPlugin(plugin) {
      this.plugins.push(markRaw(plugin));
    },
    getAnswers() {
      let result = {};
      for (let question of this.questions) {
        result[question.name] = question.answer;
      }
      return result;
    },
    getIssues() {
      let someInvalid = false;
      let result = {};
      for (let question of this.questions) {
        if (question.shouldShow && !question.isValid) {
          if (question.validationMessage === "") {
            result[question.name] = "Invalid";
            someInvalid = true;
          } else {
            result[question.name] = question.validationMessage;
            someInvalid = true;
          }
        } else if (question.shouldShow && question.answer === undefined) {
          result[question.name] = NOT_ANSWERED;
          someInvalid = true;
        }
      }
      return someInvalid ? result : undefined;
    },
    normalizeChoices(choices) {
      if (Array.isArray(choices)) {
        const mappedChoices = choices.map((value) => {
          if (value === undefined || typeof value === "string" || typeof value === "number") {
            return { name: value, value: value };
          } else {
            if (
              // eslint-disable-next-line no-prototype-builtins
              value.hasOwnProperty("name") &&
              // eslint-disable-next-line no-prototype-builtins
              !value.hasOwnProperty("value")
            ) {
              return { name: value.name, value: value.name };
            }
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
        case "confirm":
          answer = question._default;
          if (answer !== false) {
            answer = true;
          }
          return answer;
        case "list":
        case "rawlist":
        case "expand":
        case "checkbox":
          if (!Array.isArray(question._choices)) {
            this.setInvalid(question);
            return;
          }
          // handle complex choice cases below
          break;
        default:
          if (question._default === undefined) {
            this.setInvalid(question);
          }
          return question._default;
      }

      // handle complex choice cases
      let index = -1;
      switch (question.type) {
        case "list":
        case "rawlist":
          if (question._choices.length === 0 || question._default === undefined) {
            this.setInvalid(question);
            return;
          }
          if (typeof question._default === "number") {
            index = question._default;
            if (index > question._choices.length - 1) {
              index = -1;
            }
          }
          if (index < 0) {
            index = question._choices.findIndex((choice) => {
              if (question._default) {
                return isEqual(choice.value, question._default);
              }
            });
          }
          if (index < 0 || index > question._choices.length - 1) {
            this.setInvalid(question);
            return;
          } else {
            return question._choices[index].value;
          }
        case "expand":
          if (question._choices.length === 0) {
            this.setInvalid(question);
            return;
          }
          if (typeof question._default === "number") {
            index = question._default;
          } else {
            index = question._choices.findIndex(function (choice) {
              if (question._default) {
                return choice.value === question._default;
              }
            });
          }
          if (index < 0 || index > question._choices.length - 1) {
            this.setInvalid(question);
            return;
          } else {
            return question._choices[index].value;
          }
        case "checkbox": {
          const initialAnswersArray = [];
          for (let choice of question._choices) {
            let wasPushed = false;

            // add to answers if choice is in default
            if (Array.isArray(question._default)) {
              let foundIndex = question._default.findIndex((currentDefaultValue) => {
                return isEqual(choice.value, currentDefaultValue);
              });
              if (foundIndex >= 0) {
                initialAnswersArray.push(choice.value);
                wasPushed = true;
              }
            }

            // add to answers if choice is marked as checked
            if (choice.checked === true && !(question.__ForceDefault === true) && !wasPushed) {
              initialAnswersArray.push(choice.value);
            }
          }

          return initialAnswersArray;
        }
      }
    },
    async onCustomEvent(questionName, methodName, callback, ...params) {
      const relevantQuestion = this.questions.find((value) => {
        return value["name"] === questionName;
      });

      if (typeof relevantQuestion[methodName] === "function") {
        try {
          let response = await relevantQuestion[methodName](...params);
          if (callback) {
            callback(response);
          }
        } catch (e) {
          this.console.error(`Could not evaluate ${methodName}() for ${relevantQuestion.name}`);
        }
      }
    },

    async updateAdditionalMessages(question, answers, questionIndex) {
      if (typeof question.additionalMessages === "function") {
        try {
          question._additionalMessages = await question.additionalMessages(question.answer, answers);
          // Vue 2 requires a new object for reactivity to trigger updates
          this.questions.splice(questionIndex, 1, Object.assign({}, question));
        } catch (e) {
          this.console.error(`Could not evaluate additionalMessages() for ${question.name}`);
        }
      }
    },
    async onAnswerChanged(name, answer) {
      if (answer === undefined) {
        // we regard undefined as unanswered, so we do not
        // call question methods or emit the answered event
        return;
      }
      const index = this.questions.findIndex((question) => {
        return question["name"] === name;
      });

      if (index === -1) {
        return;
      }

      const answeredQuestion = this.questions[index];
      answeredQuestion.isDirty = true;

      // TODO: if input is invalid, should we update the answer?
      // set the answer
      answeredQuestion.answer = answer;
      await this.doValidate(answeredQuestion, answer);

      const answers = this.getAnswers();

      // More messages (info/warn) should only be shown when the input is valid
      if (answeredQuestion.isValid) {
        this.updateAdditionalMessages(answeredQuestion, answers, index);
      }

      // evaluate methods for other questions following answered question (e.g. when)
      let shouldStart = false;
      const whenPromises = [];
      let questionIndex = 0;
      for (let question of this.questions) {
        if (question.name === answeredQuestion.name) {
          shouldStart = true;
        } else if (shouldStart) {
          let shouldValidate = false;
          // evaluate when()
          if (typeof question.when === "function") {
            try {
              const whenPromise = question.when(answers);
              whenPromises.push(whenPromise);
              let response = await whenPromise;
              // When question shouldShow === true call validate()
              if (response) {
                shouldValidate = true;
              }
              question.shouldShow = response;
            } catch (e) {
              this.console.error(`Could not evaluate when() for ${question.name}`);
            }
          } else if (question.when !== false) {
            question.shouldShow = true;
            shouldValidate = true;
          }
          if (question.shouldShow) {
            // evaluate message()
            if (typeof question.message === "function") {
              try {
                let response = await question.message(answers);
                question._message = response;
              } catch (e) {
                this.console.error(`Could not evaluate message() for ${question.name}`);
              }
            }

            // evaluate choices()
            if (typeof question.choices === "function") {
              try {
                const response = await question.choices(answers);
                question._choices = this.normalizeChoices(response);
                if (!question.isDirty) {
                  question.answer = this.getInitialAnswer(question);
                  // optimization: avoid repeatedly calling this.getAnswers()
                  answers[question.name] = question.answer;
                  shouldValidate = true;
                }
              } catch (e) {
                this.console.error(`Could not evaluate choices() for ${question.name}`);
              }
            }

            // evaluate default()
            const applyDefaultWhenDirty =
              !question.isDirty || (question.guiOptions && question.guiOptions.applyDefaultWhenDirty);
            if (applyDefaultWhenDirty) {
              if (typeof question.default === "function") {
                try {
                  question._default = await question.default(answers);
                } catch (e) {
                  this.console.error(`Could not evaluate default() for ${question.name}`);
                }
              } else {
                question._default = question.default;
              }
              question.answer = this.getInitialAnswer(question);
              // optimization: avoid repeatedly calling this.getAnswers()
              answers[question.name] = question.answer;
              shouldValidate = true;
            }

            if (shouldValidate) {
              await this.doValidate(question, question.answer);
            }
            // evaluate additionalMessages
            if (question.isValid) {
              this.updateAdditionalMessages(question, answers, questionIndex);
            }
          }
        }
        questionIndex++;
      }

      // apply filters
      let filteredAnswers = {};
      Object.assign(filteredAnswers, answers);
      for (let question of this.questions) {
        if (question.filter) {
          // call filter()
          const currentAnswer = answers[question.name];
          try {
            const filteredAnswer = await question.filter(currentAnswer);
            filteredAnswers[question.name] = filteredAnswer;
          } catch (e) {
            this.console.error(`Could not evaluate filter() for ${question.name}`);
          }
        }
      }

      Promise.all(whenPromises).then(() => {
        this.$emit("whensEvaluated");
      });

      const issues = this.getIssues();
      this.removeShouldntShows(this.questions, filteredAnswers);
      // fire 'answered' event
      this.$emit("answered", filteredAnswers, issues);
    },
  },
  watch: {
    questions: async function (newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      // 1st pass: set initial values
      for (let question of this.questions) {
        // question type
        if (!question.type) {
          question.type = "input";
        }

        // message
        const message = typeof question.message === "string" ? question.message : question.name;
        question["_message"] = message;

        // choices
        if (question.choices) {
          let choices = [];
          if (typeof question.choices !== "function") {
            choices = this.normalizeChoices(question.choices);
          }
          question["_choices"] = choices;
        }

        // default
        if (question.default !== undefined) {
          let _default;
          if (typeof question.default !== "function") {
            if (question.__origAnswer === undefined) {
              _default = question.default;
            } else {
              _default = question.__origAnswer;
            }
          }
          question["_default"] = _default;
        } else if (question._default === undefined) {
          question["_default"] = question.__origAnswer;
        }

        // validity
        question["isValid"] = true;
        question["validationMessage"] = "";

        // mandatory
        this.setIsMandatory(question);

        // dirty
        question["isDirty"] = question.__origAnswer !== undefined;

        // answer
        let answer = this.getInitialAnswer(question);
        question["answer"] = answer;

        // visibility
        const shouldShow = question.when === false || typeof question.when === "function" ? false : true;
        question["shouldShow"] = shouldShow;
      }

      const answers = this.getAnswers();
      // 2nd pass: evaluate properties that are functions
      const whenPromises = [];
      let questionIndex = 0;
      for (let question of this.questions) {
        // evaluate when()
        if (typeof question.when === "function") {
          try {
            const whenPromise = question.when(answers);
            whenPromises.push(whenPromise);
            let response = await whenPromise;
            question.shouldShow = response;
          } catch (e) {
            this.console.error(`Could not evaluate when() for ${question.name}`);
          }
        }

        if (question.shouldShow) {
          // evaluate message()
          if (typeof question.message === "function") {
            try {
              const response = await question.message(answers);
              question._message = response;
            } catch (e) {
              this.console.error(`Could not evaluate message() for ${question.name}`);
            }
          }

          // evaluate choices()
          if (typeof question.choices === "function") {
            try {
              const response = await question.choices(answers);
              question._choices = this.normalizeChoices(response);
              question.answer = this.getInitialAnswer(question);
              // optimization: avoid repeatedly calling this.getAnswers()
              answers[question.name] = question.answer;
            } catch (e) {
              this.console.error(`Could not evaluate choices() for ${question.name}`);
            }
          }

          // evaluate default()
          if (typeof question.default === "function") {
            try {
              if (question.__origAnswer === undefined) {
                question._default = await question.default(answers);
              } else {
                question._default = question.__origAnswer;
              }
              question.answer = this.getInitialAnswer(question);

              // optimization: avoid repeatedly calling this.getAnswers()
              answers[question.name] = question.answer;
            } catch (e) {
              this.console.error(`Could not evaluate default() for ${question.name}`);
            }
          }

          // evaluate validate()
          await this.doValidate(question, question.answer);
          // evaluate additionalMessages()
          if (typeof question.additionalMessages === "function" && question.isValid) {
            this.updateAdditionalMessages(question, answers, questionIndex);
          }
        }
        questionIndex++;
      }

      Promise.all(whenPromises).then(() => {
        this.$emit("whensEvaluated");
      });

      const issues = this.getIssues();
      this.removeShouldntShows(this.questions, answers);
      // fire 'answered' event
      this.$emit("answered", answers, issues);
    },
  },
  created() {
    this.plugins = markRaw(Plugins.registerBuiltinPlugins());
  },
};
</script>

<style lang="scss">
$color-error: var(--vscode-notificationsErrorIcon-foreground, #f14c4c);
$color-warn: var(--vscode-notificationsWarningIcon-foreground, #cca700);
$color-info: var(--vscode-notificationsInfoIcon-foreground, #3794ff);

a {
  color: var(--vscode-textLink-foreground, #1976d2);
  cursor: pointer;
}

.inquirer-gui p.question-label {
  margin-top: 0.6rem;
  margin-bottom: 0.05rem;
}

.inquirer-gui .v-text-field div.v-text-field__details {
  margin-bottom: 2px;
}

.inquirer-gui .v-text-field input {
  padding: 0px;
}

.inquirer-gui .v-input--selection-controls {
  margin-top: 0rem;
}

/* mandatory asterisk div */
.mandatory-asterisk {
  padding-left: 4px;
}

/* Question hint div, Question link div */
.question-hint,
.question-link {
  padding-left: 4px;
}

/* Error validation text div */
.error-validation-text {
  @extend .messages-text;
  @extend .severity-error;
}

/* Question valdation message with link icon img */
.validation-link-icon {
  vertical-align: middle;
  padding-right: 5px;
  color: var(--vscode-icon-foreground);
}

.add-messages,
.validation-messages {
  padding-top: 4px;
  display: flex;
  align-items: flex-start;
  /* Icons that appear adjacent to message texts */
  .messages-icon.v-icon {
    font-size: 20px;
    padding-right: 4px;
    &.severity-error {
      color: #{$color-error};
    }
    &.severity-warn {
      color: #{$color-warn};
    }
    &.severity-info {
      color: #{$color-info};
    }
  }

  /* Messages that appear under prompts - validation (error), info and warning */
  .messages-text {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-break: normal;
    padding-top: 0.083em; // 1px at font-size 12px

    &.severity-error {
      color: #{$color-error};
    }
    &.severity-warn {
      color: #{$color-warn};
    }
    &.severity-info {
      color: var(--vscode-foreground);
    }
  }
}
</style>
