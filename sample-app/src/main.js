import Vue from "vue";
import App from "./App.vue";
import "@sap-devx/inquirer-gui/dist/form.css";
import Form from "@sap-devx/inquirer-gui";
/** During development:
 *    in terminal type: npm run prep-local
 *    uncomment line below and comment line above*/
// import Form from "../form/form.umd";

const SAP_IMAGE = "data:image/png;base64,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";

const questions1 = [
  {
    name: "appType",
    type: "list",
    guiType: "tiles",
    choices: [
      { value: "listReport", name: "List Report", description: "With a list report, ...", image: SAP_IMAGE },
      { value: "masterDetail", name: "Master-Detail Application", description: "Create an SAP HANA data model, ..."}
    ]
  },
  {
    name: "noType",
  },
  {
    type: "password",
    guiType: "login",
    name: "login",
    message: "Login",
    default: "",
    validate: async function (answer, answers) {
      if (!answer) {
        return "Must enter password"
      } else {
        // perform login
        return true;
      }
    }
  },
  {
    type: "input",
    guiType: "file-browser",
    name: "configFile",
    message: "Config file (vscode)",
    default: "/home/",
    getFilePath: async function (currentPath) {
        return `${currentPath}subdir/`;
    }
  },
  {
      type: "date",
      name: "birthday",
      message: "Birthday"
  },
  {
      type: "input",
      name: "name",
      message: "Your name (frontend)",
      default: "Joe",
      validate: function (input) {
          if (input.length >= 2) {
              return true;
          } else {
              return "Name must be at least 2 characters long";
          }
      }
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
          return `${input}!!!`
      }
  },
  {
      type: "password",
      name: "password",
      message: "A password"
  },
  {
      type: "number",
      name: "number",
      message: "A number",
      default: "0"
  },
  {
      type: "input",
      name: "street address",
      message: "Your address",
      default: "1 Main street",
      when: function (answers) {
          return answers.name !== "Joker";
      },
      validate: function(answer, answers) {
        return (answer.length < 2 ? "Must enter at least 2 characters" : true);
      }
  },
  {
      type: "list",
      name: "country",
      message: "The country where you live",
      choices: ["USA", {name:"Germany"}, "China", "Israel"],
      default: "Germany"
  },
  {
      type: "checkbox",
      name: "citizenship",
      message: "Your citizenship",
      choices: ["USA", {name:"Germany", value:"Germany"}, "China", "Israel"],
      default: ["Germany", "USA"]
  },
  {
      type: "expand",
      name: "agree",
      message: "Do you agree to the conditions?",
      choices: ["Yes", "No", "Maybe"],
      default: "No"
  }
];

const questions2 = [
  {
    type: "list",
    name: "countryCode",
    message: "Your country code",
    choices: [
      { name: "+1", value: 1 },
      "+49",
      { name: "+86", value: 86 },
      { name: "+972", value: 972 }
    ],
    default: 86
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China" },
      "Israel"
    ],
    default: ["Germany"],
    validate: function(input, answers) {
      return (input.length === 0 ? "Must choose at least one country" : true)
    }
   },
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", {type: "separator"}, "Maybe"],
    validate: function(input, answers) {
      return (input ? true : "Must choose an answer");
    }
  },
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure?",
    default: false
  },
  {
    type: "checkbox",
    name: "citizenship2",
    message: "Your citizenship2",
    choices: function (answers) {
      return [
        "USA",
        { type: "separator" },
        "Germany"
      ]
    }
  }
];
const questionsArray = [questions1, questions2];

import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
const options = {};
Vue.use(Form, options);

let vueOptions = {
  render: h => h(App),
  data() {
    return {
      questionsIndex: 0
    }
  },
  methods: {
    prompt(questions) {
      this.$children[0].questions = questions;
    }
  },
  mounted() {
    console.log('sample app is mounted');
    this.prompt(questionsArray[0]);
  },
};

if (options.vuetify) {
  vueOptions.vuetify = options.vuetify;
} else {
  vueOptions.vuetify = vuetify;
}

export default new Vue(
  vueOptions
).$on('next', function () {
  if (this.questionsIndex === 0) {
    this.questionsIndex = 1;
    this.prompt(questionsArray[1]);
  }
}
).$mount('#app');
