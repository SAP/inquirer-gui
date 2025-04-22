import { IRpc } from "@sap-devx/webview-rpc/out.ext/rpc-common";

function funcReplacer(key: any, value: any) {
  return typeof value === "function" ? "__Function" : value;
}

function normalizeFunctions(questions: Array<any>) {
  return JSON.parse(JSON.stringify(questions, funcReplacer));
}

const questions1 = [
  {
    type: "input",
    guiOptions: {
      type: "file-browser",
    },
    name: "configFile",
    message: "Config file (vscode)",
    default: "/home/",
    getFilePath: async function (currentPath: string, showOpenDialog: Function) {
      return await showOpenDialog(currentPath);
    },
  },
  {
    type: "input",
    name: "name",
    message: "Your name (backend)",
    default: "Jack",
    // validate: function (input: any) {
    //     if (input.length >= 2) {
    //         return true;
    //     } else {
    //         return "Name must be at least 2 characters long";
    //     }
    // }
  },
  {
    type: "input",
    name: "notes",
    message: function (answers: any) {
      return `Information about ${answers.name}`;
    },
    default: function (answers: any) {
      return `Information about ${answers.name}`;
    },
    filter: function (input: any) {
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
    when: function (answers: any) {
      return answers.name !== "Joker";
    },
  },
  {
    type: "input",
    guiOptions: {
      type: "radio",
      hint: "Please select",
    },
    name: "pat",
    message: "Your pet",
    choices: ["dog", "cat"],
    default: "cat",
  },
  {
    type: "single-checkbox",
    hint: "Please check this option if you want a gift",
    name: "WantGift",
    title: "Want a gift",
    default: true,
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

export class InquirerGui {
  private rpc: IRpc;
  private questions: Array<any>;
  private showOpenDialog: Function;

  constructor(rpc: IRpc, showOpenDialogCallback: Function) {
    this.rpc = rpc;
    this.questions = questions1;
    this.rpc = rpc;
    this.showOpenDialog = showOpenDialogCallback;
    this.registerMethods();
  }

  registerMethods() {
    this.rpc.registerMethod({ func: this.evaluateMethod, thisArg: this });
    this.rpc.registerMethod({ func: this.onClientIsReady, thisArg: this });
  }

  async evaluateMethod(questionName: string, methodName: string, params: Array<any>) {
    console.log(`evaluating method ${questionName}.${methodName}`);
    let relevantQuestion = undefined;
    for await (const question of this.questions) {
      if (question.name === questionName) {
        relevantQuestion = question;
        break;
      }
    }
    if (relevantQuestion !== undefined) {
      // This part is a bit dirty, but the idea is to keep
      // this file clean of references to vscode:
      if (methodName === "getFilePath") {
        params = [...params, this.showOpenDialog];
      }
      const response = await relevantQuestion[methodName].apply(this.questions, params);
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
}
