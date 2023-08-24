function funcReplacer(key, value) {
  return typeof value === "function" ? "__Function" : value;
}

function normalizeFunctions(questions) {
  return JSON.parse(JSON.stringify(questions, funcReplacer));
}

const questions1 = [
  {
    type: "input",
    name: "name",
    message: "Your name (backend)",
    default: "Jack",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
        return "Name must be at least 2 characters long";
      }
    },
  },
  {
    type: "input",
    guiOptions: {
      type: "radio",
      hint: "Please select radio",
    },
    name: "flour",
    message: "your flour",
    choices: ["daffodil", "rose"],
    default: "daffodil",
  },
  {
    type: "single-checkbox",
    hint: "Please check this option if you want a gift",
    name: "WantGift",
    title: "Want a gift",
    default: true,
  },
  {
    type: "input",
    name: "notes",
    message: function (answers) {
      return `Information about ${answers.name}`;
    },
    default: function (answers) {
      return `Information about ${answers.name}`;
    },
    filter: function (input) {
      return `${input}!!!`;
    },
  },
  {
    type: "password",
    name: "password",
    message: "A password",
  },
  {
    type: "number",
    name: "number",
    message: "A number",
    default: "0",
  },
  {
    type: "input",
    name: "street address",
    message: "Your address",
    default: "1 Main street",
    when: function (answers) {
      return answers.name !== "Joker";
    },
  },
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: ["USA", "Germany", "China", "Israel"],
    default: "USA",
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: ["USA", "Germany", "China", "Israel"],
    default: ["Germany"],
  },
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"],
    default: "No",
  },
];

module.exports = class InquirerGuiBackend {
  constructor(rpc) {
    this.questions = questions1;
    this.rpc = rpc;
    this.registerMethods();
  }

  registerMethods() {
    this.rpc.registerMethod({ func: this.evaluateMethod, thisArg: this });
    this.rpc.registerMethod({ func: this.onClientIsReady, thisArg: this });
  }

  async evaluateMethod(questionName, methodName, params) {
    console.log(`evaluating method ${questionName}.${methodName}`);
    let relevantQuestion = undefined;
    for await (let question of this.questions) {
      if (question.name === questionName) {
        relevantQuestion = question;
        break;
      }
    }
    if (relevantQuestion !== undefined) {
      const response = await relevantQuestion[methodName].apply(
        this.questions,
        params,
      );
      console.log(response);
      return response;
    }
    return `${questionName}.${methodName} could not be evaluated on the backend`;
  }

  onClientIsReady() {
    console.log(`client is ready. sending questions`);
    const normalizedQuestions = normalizeFunctions(this.questions);
    this.rpc.invoke("prompt", [normalizedQuestions]);
  }
};
