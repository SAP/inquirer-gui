import Vue from "vue";
import App from "./App.vue";
import "@sap-devx/inquirer-gui/dist/form.css";
import Form from "@sap-devx/inquirer-gui";
const SAP_IMAGE = require("./sapImage").default;
/** During development:
 *    in terminal type: npm run prep-local
 *    uncomment line below and comment line above*/
// import Form from "../form/form.umd";

const questions0 = [
  {
    name: "appType",
    message: "",
    type: "list",
    guiType: "tiles",
    choices: [
      { value: "listReport", name: "List Report", description: "With a list report, ...", homepage: "http://www.sap.com", image: SAP_IMAGE },
      { value: "masterDetail", name: "Master-Detail Application", description: "Create an SAP HANA data model, ..."}
    ],
    default: "masterDetail"
  }
];
  
const questions1 = [
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

const questionsArray = [questions0, questions1, questions2];

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
  if (this.questionsIndex < questionsArray.length-1) {
    this.questionsIndex++;
    this.prompt(questionsArray[this.questionsIndex]);
  }
}
).$mount('#app');
