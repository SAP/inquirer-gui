<template>
  <v-form class="inquirer-gui">
    <template v-for="(question, index) in questions">
      <p
        :key="'label-' + index"
        class="question-label"
        v-if="question.shouldShow"
      >
        <span class="question-message">{{question._message}}</span>
        <span class="question-hint" v-if="question.guiOptions && question.guiOptions.hint">
          <v-tooltip top max-width="350px">
            <template v-slot:activator="{on}">
              <v-icon v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            <span>{{question.guiOptions.hint}}</span>
          </v-tooltip>
        </span>
        <span class="mandatory-asterisk" v-if="question.isMandatory">*</span>
        <span class="question-link" v-if="question.guiOptions && question.guiOptions.link">
          <a v-if="question.guiOptions.link.command" :command="question.guiOptions.link.command.id" :params="question.guiOptions.link.command.params" @click="executeCommand">{{question.guiOptions.link.text}}</a>
          <a v-else-if="question.guiOptions.link.url" target="_blank" :href="question.guiOptions.link.url">{{question.guiOptions.link.text}}</a>
        </span>
      </p>
      <component
        v-if="question.shouldShow"
        :is="getComponentByQuestionType(question)"
        :key="index"
        :question="question"
        @answerChanged="onAnswerChanged"
        @customEvent="onCustomEvent"
      ></component>
      <div
        v-if="shouldShowValidationMessage(question)"
        class="error-validation-text"
        :key="'validation-' + index"
      >{{question.validationMessage}}</div>
    </template>
	<v-text-field id="form-single-input-issue-key-enter-workaround" style="display:none;"/>
  </v-form>
</template>

<script>
import Plugins from "./Plugins";
const assert = require('assert');

const NOT_ANSWERED = "Mandatory field";
const MANDATORY_TYPES = ["list", "rawlist", "expand"];

export default {
  name: "Form",
  props: {
    questions: Array
  },
  data() {
    return {
      plugins: null
    };
  },
  computed: {
    console: () => console
  },
  methods: {
    executeCommand(event) {
      this.$emit("parentExecuteCommand", event);
    },
    shouldShowValidationMessage(question) {
      return question.shouldShow && !question.isValid && 
        ((question.__origAnswer !== undefined) || !(question.guiOptions && question.guiOptions.hint && !question.isDirty));
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
      } catch(e) {
        const errorMessage = `Could not evaluate validate() for ${question.name}. ${e.message}`;
        this.console.error(errorMessage);
        this.setInvalid(question, errorMessage);
      }
    }, 
    setInvalid(question, message = NOT_ANSWERED) {
      question.isValid = false;
      question.validationMessage = message;
    },
    setValid(question) {
      question.isValid = true;
      question.validationMessage = "";
    },
    setIsMandatory(question) {
	question.isMandatory = MANDATORY_TYPES.includes(question.type) ||
		((question.guiOptions && question.guiOptions.mandatory === true) && (typeof question.validate === "function"));
    },
    getComponentByQuestionType(question) {
      const guiType= question.guiOptions && question.guiOptions.type ? question.guiOptions.type : question.guiType;
      let foundPlugin;
      if (guiType) {
        foundPlugin = this.plugins.find(plugin => {
          return plugin.questionType === guiType;
        });
        if (foundPlugin) {
          return foundPlugin.component;
        }
      }
      foundPlugin = this.plugins.find(plugin => {
        return plugin.questionType === question.type;
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
      return (someInvalid ? result : undefined);
    },
    normalizeChoices(choices) {
      if (Array.isArray(choices)) {
        const mappedChoices = choices.map(value => {
          if (value === undefined || typeof value === "string" || typeof value === "number") {
            return { name: value, value: value };
          } else {
            if (value.hasOwnProperty("name") && !value.hasOwnProperty("value")) {
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
            index = question._choices.findIndex(choice => {
              if (question._default) {
                try {
                  assert.deepEqual(choice.value, question._default);
                  return true;
                } catch (error) {
                  return false;
                } 
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
              let foundIndex = question._default.findIndex(
                currentDefaultValue => {
                  return choice.value === currentDefaultValue;
                }
              );
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
      const relevantQuestion = this.questions.find(value => {
        return value["name"] === questionName;
      });

      if (typeof relevantQuestion[methodName] === "function") {
        try {
          let response = await relevantQuestion[methodName](...params);
          if (callback) {
            callback(response);
          }
        } catch(e) {
          this.console.error(`Could not evaluate ${methodName}() for ${relevantQuestion.name}`);
        }
      }
    },
    async onAnswerChanged(name, answer) {
      if (answer === undefined) {
        // we regard undefined as unaswered, so we do not
        // call question methods or emit the answered event
        return;
      }
      const index = this.questions.findIndex(question => {
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
      // evaluate methods for questions following answered question (e.g. when)
      let shouldStart = false;
      const whenPromises = []; 
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
              // When question was shouldShow === false, and
              //   it becomes shouldShow === true, call validate()
              if (!question.shouldShow && response) {
                shouldValidate = true;
              }
              question.shouldShow = response;
            } catch(e) {
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
              } catch(e) {
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
              } catch(e) {
                this.console.error(`Could not evaluate choices() for ${question.name}`);
              }
            }

            // evaluate default()
            const applyDefaultWhenDirty = !question.isDirty || (question.guiOptions && question.guiOptions.applyDefaultWhenDirty);
            if (applyDefaultWhenDirty) {
              if (typeof question.default === "function") {
                try {
                  question._default = await question.default(answers);
                } catch(e) {
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
          }
        }
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
          } catch(e) {
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
    }
  },
  watch: {
    questions: async function(newVal, oldVal) {
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
        if (question.default !== undefined) {
          let _default;
          if (typeof question.default !== "function") {
            if (question.__origAnswer === undefined) {
              _default = question.default;
            } else {
              _default = question.__origAnswer; 
            }
          }
          this.$set(question, "_default", _default);
        } else if (question._default === undefined) {
          this.$set(question, "_default", question.__origAnswer);
        }

        // validity
        this.$set(question, "isValid", true);
        this.$set(question, "validationMessage", "");
	
	// mandatory
	this.setIsMandatory(question);

        // dirty
        this.$set(question, "isDirty", false);

        // answer
        let answer = this.getInitialAnswer(question);
        this.$set(question, "answer", answer);

        // visibility
        const shouldShow = (question.when === false || (typeof question.when === "function")) ? false : true;
        this.$set(question, "shouldShow", shouldShow);
      }

      const answers = this.getAnswers();
      // 2nd pass: evaluate properties that are functions
      const whenPromises = [];
      for (let question of this.questions) {
        // evaluate when()
        if (typeof question.when === "function") {
          try {
            const whenPromise = question.when(answers);
            whenPromises.push(whenPromise);
            let response = await whenPromise;
            question.shouldShow = response;
          } catch(e) {
            this.console.error(`Could not evaluate when() for ${question.name}`);
          }
        }

        if (question.shouldShow) {
          // evaluate message()
          if (typeof question.message === "function") {
            try {
              const response = await question.message(answers);
              question._message = response;
            } catch(e) {
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
            } catch(e) {
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
            } catch(e) {
              this.console.error(`Could not evaluate default() for ${question.name}`);
            }
          }

          // evaluate validate()
          await this.doValidate(question, question.answer);
        }
      }

      Promise.all(whenPromises).then(() => {
        this.$emit("whensEvaluated");
      });

      const issues = this.getIssues();
      this.removeShouldntShows(this.questions, answers);
      // fire 'answered' event
      this.$emit("answered", answers, issues);
    }
  },
  created() {
    this.plugins = Plugins.registerBuiltinPlugins();
  }
};
</script>

<style>
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

/* Error validation text div */
.error-validation-text {
  font-size: 12px;
  padding-left: 12px;
  color: #ff5252;
}

/* Question hint div, Question link div */
.question-hint, .question-link {
  padding-left: 4px;
}

</style>
