import Vue from "vue";
import App from "./App.vue";
// import Form from "@sap-devx/inquirer-gui";
import "@sap-devx/inquirer-gui/dist/form.css";
import Form from "../../src/index";

const questions1 = [
  {
    type: "input",
    name: "A string"
  },
  {
    type: "remote-file-browser",
    name: "configFile",
    message: "Config file",
    default: "/home/",
    getFilePath: async function (currentPath) {
      return `${currentPath}user`;
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
    name: "conditional",
    message: "Conditional",
    default: "Never shows",
    when: false
  },
  {
    type: "editor",
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
    }
  },
  {
    type: "list",
    name: "country",
    message: "The country where you live",
      
    choices: ["USA", { type: 'separator'}, "Germany", "China", "Israel"]
  }
];
const questions2 = [
  {
    type: "list",
    name: "countryCode",
    message: "Your country code",
    choices: [
      { name: "+1", value: 1 },
      { name: "+49" },
      { name: "+86", value: 86 },
      { name: "+972", value: 972 }
    ],
    default: { name: "+49", value: 49 }
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
    default: ["Germany"]
  },
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", {type: "separator"}, "Maybe"],
    default: 1
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
