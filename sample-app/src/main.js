import Vue from "vue";
import App from "./App.vue";
// import Form from "@sap-devx/inquirer-gui";
import "@sap-devx/inquirer-gui/dist/form.css";
// For development use local file:
import Form from "../../src/index";

const questions1 = [
  {
    name: "appType",
    type: "list",
    guiType: "tiles",
    choices: [
      { value: "list", name: "List Report", description: "With a list report, ...", image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgdmlld0JveD0iMCAwIDk5Ljk5OTk5NyA5OS45OTk5OTciCiAgIGhlaWdodD0iMTAwIgogICB3aWR0aD0iMTAwIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNCIgLz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE3Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTk1Mi4zNjIyMykiCiAgICAgaWQ9ImxheWVyMSI+CiAgICA8cGF0aAogICAgICAgZD0iTSA1MC4wMDAwMDEsOTU0LjgwOTM5IDY1LjQ1MDg0OCw5ODYuMTE2MjQgMTAwLDk5MS4xMzY1MiA3NC45OTk5OTgsMTAxNS41MDU1IDgwLjkwMTY5OSwxMDQ5LjkxNSA1MCwxMDMzLjY2OTEgMTkuMDk4Mjk4LDEwNDkuOTE1IDI1LjAwMDAwMSwxMDE1LjUwNTUgLTEuMjEzNDMzNmUtNiw5OTEuMTM2NTIgMzQuNTQ5MTUxLDk4Ni4xMTYyNCBaIgogICAgICAgaWQ9InBhdGg0MTM2IgogICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjAuNTAyMjIyMjQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIyLjY3NzE2NTk5O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogIDwvZz4KPC9zdmc+Cg==" },
      { value: "masterDetail", name: "Master-Detail Application", description: "Create an SAP HANA data model, ...", image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgdmlld0JveD0iMCAwIDk5Ljk5OTk5NyA5OS45OTk5OTciCiAgIGhlaWdodD0iMTAwIgogICB3aWR0aD0iMTAwIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNCIgLz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE3Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZwogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTk1Mi4zNjIyMykiCiAgICAgaWQ9ImxheWVyMSI+CiAgICA8cGF0aAogICAgICAgZD0iTSA1MC4wMDAwMDEsOTU0LjgwOTM5IDY1LjQ1MDg0OCw5ODYuMTE2MjQgMTAwLDk5MS4xMzY1MiA3NC45OTk5OTgsMTAxNS41MDU1IDgwLjkwMTY5OSwxMDQ5LjkxNSA1MCwxMDMzLjY2OTEgMTkuMDk4Mjk4LDEwNDkuOTE1IDI1LjAwMDAwMSwxMDE1LjUwNTUgLTEuMjEzNDMzNmUtNiw5OTEuMTM2NTIgMzQuNTQ5MTUxLDk4Ni4xMTYyNCBaIgogICAgICAgaWQ9InBhdGg0MTM2IgogICAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjAuNTAyMjIyMjQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIyLjY3NzE2NTk5O3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPgogIDwvZz4KPC9zdmc+Cg==" }
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
