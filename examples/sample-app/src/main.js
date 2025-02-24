import { createApp, h } from "vue";
import App from "./App.vue";

// import "@sap-devx/inquirer-gui/dist/form.css";
// import Form from "@sap-devx/inquirer-gui";
import Form from "../../../packages/inquirer-gui/src";

// import "@sap-devx/inquirer-gui-auto-complete-plugin/dist/autoCompletePlugin.css";
// import AutoCompletePlugin from '@sap-devx/inquirer-gui-auto-complete-plugin';
import AutoCompletePlugin from "../../../packages/auto-complete-plugin/src";

// import "@sap-devx/inquirer-gui-file-browser-plugin/dist/fileBrowserPlugin.css";
// import FileBrowserPlugin from '@sap-devx/inquirer-gui-file-browser-plugin';
import FileBrowserPlugin from "../../../packages/file-browser-plugin/src";

// import "@sap-devx/inquirer-gui-folder-browser-plugin/dist/folderBrowserPlugin.css";
// import FolderBrowserPlugin from '@sap-devx/inquirer-gui-folder-browser-plugin';
import FolderBrowserPlugin from "../../../packages/folder-browser-plugin/src";

// import "@sap-devx/inquirer-gui-label-plugin/dist/labelPlugin.css";
// import LabelPlugin from '@sap-devx/inquirer-gui-label-plugin';
import LabelPlugin from "../../../packages/label-plugin/src";

// import "@sap-devx/inquirer-gui-login-plugin/dist/loginPlugin.css";
// import LoginPlugin from '@sap-devx/inquirer-gui-login-plugin';
import LoginPlugin from "../../../packages/login-plugin/src";

// import "@sap-devx/inquirer-gui-radio-plugin/dist/radioPlugin.css";
// import RadioPlugin from '@sap-devx/inquirer-gui-radio-plugin';
import RadioPlugin from "../../../packages/radio-button-plugin/src";

// import "@sap-devx/inquirer-gui-single-checkbox-plugin/dist/singleCheckboxPlugin.css"
// import SingleCheckboxPlugin from '@sap-devx/inquirer-gui-single-checkbox-plugin';
import SingleCheckboxPlugin from "../../../packages/single-checkbox-plugin/src";

// import "@sap-devx/inquirer-gui-tiles-plugin/dist/tilesPlugin.css";
// import TilesPlugin from '@sap-devx/inquirer-gui-tiles-plugin';
import TilesPlugin from "../../../packages/tiles-plugin/src";

// import DateInputPlugin from '../../sample-plugin/src';

import SAP_IMAGE from "./sapImage";
import WORKFLOW_IMAGE from "./workflowImage";

/**
 *  During development:
 *    in terminal type: npm run prep-local
 *    uncomment lines below and comment lines above
 * import "../form/form.css";
 * import Form from "../form/form.umd";
 **/

const states = [
  "Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Federated States of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Island",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
let filteredStates = [];

const questions0 = [
  {
    name: "appType",
    message: "",
    type: "list",
    guiOptions: {
      type: "tiles",
    },
    choices: [
      {
        value: "listReport",
        name: "List Report",
        description:
          "A List report is similar to a table report with rows and columns of data. Each row is one record and each column is a Field. This type of report is often used when you want to see more number of records at a time. It is a simple yet powerful report type that can display any columns you want and in the required order.",
        homepage: "http://www.sap.com",
        image: SAP_IMAGE,
      },
      {
        value: "masterDetail",
        name: "Master-Detail Application",
        description: "Create an SAP HANA data model ",
        homepage: "http://www.sap.com",
        image: WORKFLOW_IMAGE,
      },
    ],
    default: "masterDetail",
  },
];

const questions1 = [
  {
    name: "noType",
    placeholder: "This is a placeholder.",
  },
  {
    type: "input",
    guiOptions: {
      type: "label",
    },
    name: "label",
    message: "Label-Plugin",
    default:
      '<p style="color:green">Default value for <a href="https://github.com/SAP/inquirer-gui/tree/master/label-plugin">Label-Plugin</a> with html tags.</p>',
  },
  {
    type: "password",
    guiOptions: {
      type: "login",
      hint: "Please enter your password",
    },
    name: "login",
    message: "Login",
    default: "",
    validate: async function (answer) {
      if (!answer) {
        return "Must enter password";
      } else {
        // perform login
        return true;
      }
    },
  },
  {
    type: "input",
    guiOptions: {
      type: "radio",
      hint: "Please select a radio",
    },
    name: "mood",
    message: "Select mood",
    choices: ["happy", "sad"],
    default: "happy",
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
    guiOptions: {
      type: "file-browser",
      applyDefaultWhenDirty: true,
      link: {
        text: "New Untitled File",
        command: {
          id: "workbench.action.files.newUntitledFile",
          params: ["a"],
        },
      },
    },
    name: "configFile",
    message: "Config file (vscode)",
    default: "/home/",
    getFilePath: async function (currentPath) {
      return `${currentPath}subdir/`;
    },
  },
  // Excluding Date for the time being as DateInput is a lab component in Vuetify v3
  // {
  //     type: "date",
  //     name: "birthday",
  //     message: "Birthday"
  // },
  {
    type: "input",
    name: "name",
    guiOptions: {
      hint: "A personal name or full name is the set of names by which an individual is known and that can be recited as a word-group, with the understanding that, taken together, they all relate to that one individual.",
    },
    message: "Your name (frontend)",
    default: "Joe",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
        return "Must be at least 2 characters long";
      }
    },
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
    type: "input",
    guiOptions: {
      applyDefaultWhenDirty: true,
    },
    name: "applyDefaultWhenDirty",
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
    default: "2",
    additionalMessages: (input) => {
      if (input === "0") {
        return {
          message: "0 is an error message",
          severity: input,
        };
      }
      if (input === "1") {
        return {
          message: "1 is a warning message",
          severity: input,
        };
      }
      if (input === "2") {
        return {
          message: "2 is an informational message",
          severity: input,
        };
      }
    },
  },
  {
    type: "input",
    name: "street address",
    message: "Your address",
    default: "1 Main street",
    when: function (answers) {
      return answers.name !== "Joker";
    },
    validate: function (answer) {
      return answer.length < 2 ? "Must enter at least 2 characters" : true;
    },
  },
  {
    type: "list",
    name: "country",
    message: "The country where you live",
    choices: [
      { type: "separator", line: "──────────────" },
      "USA",
      { name: "Germany" },
      { type: "separator", line: "\u001b[2m──────────────\u001b[22m" },
      "China",
      { type: "separator", line: "\u001b[2mCustom Separator\u001b[22m" },
      "Israel",
    ],
    default: "Germany",
    guiOptions: {
      link: {
        text: "wikipedia",
        url: "https://en.wikipedia.org/wiki/Country",
      },
    },
  },
  {
    name: "state",
    type: "autocomplete",
    message: "US State:",
    source: (answers, input) => {
      // Simulated remote api call
      filteredStates = states.filter((state) => {
        return state.startsWith(input);
      });
      console.log(`States: ${JSON.stringify(answers)}`);
      if (answers && answers.country !== "USA") {
        filteredStates.unshift("Not Applicable");
      }
      console.log(`States: ${JSON.stringify(filteredStates)}`);
      return filteredStates;
    },
    additionalInfo: () => `${filteredStates.length} results returned`,
    emptyText: "No results available right now....",
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: ["USA", { name: "Germany", value: "Germany" }, "China", "Israel"],
    default: ["Germany", "USA"],
  },
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", "Maybe"],
    default: "No",
  },
  {
    type: "confirm",
    name: "confirm",
    message: "Do you want to save your changes?",
    labelFalse: "No, discard changes",
    default: false,
  },
  {
    type: "input",
    guiOptions: {
      type: "radio",
    },
    name: "survey",
    orientation: "vertical",
    message: "How did you hear about us?",
    default: "Google",
    choices: ["Google", "Facebook", "Twitter", { value: "LinkedIn", disabled: true }, "Other"],
  },
];

const questions2 = [
  {
    type: "list",
    name: "countryCode",
    message: "Your country code",
    choices: [{ name: "+1", value: 1 }, "+49", { name: "+86", value: 86 }, { name: "+972", value: 972 }],
    default: 86,
  },
  {
    type: "list",
    name: "countryCode2",
    message: "Your country code2",
    default: function (answers) {
      return answers.countryCode === 1 ? undefined : "+0";
    },
    guiOptions: {
      applyDefaultWhenDirty: true,
      hint: "Please select your country code",
    },
    choices: function (answers) {
      return answers.countryCode === 972
        ? ["+0", { name: "+1", value: 1 }, "+2", { name: "+3", value: 3 }, { name: "+4", value: 4 }]
        : ["+0", { name: "+10", value: 10 }, "+9", { name: "+8", value: 8 }, { name: "+7", value: 7 }];
    },
  },
  {
    type: "checkbox",
    name: "citizenship",
    message: "Your citizenship",
    choices: [
      { name: "United States of America", value: "USA" },
      "Germany",
      { name: "People's Republic of China", value: "China" },
      "Israel",
    ],
    default: ["Germany"],
    validate: function (input) {
      return input.length === 0 ? "Must choose at least one country" : true;
    },
  },
  {
    type: "expand",
    name: "agree",
    message: "Do you agree to the conditions?",
    choices: ["Yes", "No", { type: "separator" }, "Maybe"],
    validate: function (input) {
      return input ? true : "Must choose an answer";
    },
  },
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure?",
    labelTrue: "Yes, I am sure!",
    labelFalse: "No, I am still contemplating...",
    default: false,
  },
  {
    type: "checkbox",
    name: "citizenship2",
    message: "Your citizenship2",
    choices: function () {
      return ["USA", { type: "separator" }, "Germany"];
    },
  },
];

const questionsArray = [questions0, questions1, questions2];

const plugins = [];

import vuetify from "./plugins/vuetify";

const app = createApp({
  render: (vm) =>
    h(App, {
      ref: "appRef",
      onNextSection: () => {
        if (vm.questionsIndex < questionsArray.length - 1) {
          vm.questionsIndex++;
          vm.prompt(questionsArray[vm.questionsIndex]);
        }
      },
    }),
  data() {
    return {
      questionsIndex: 0,
    };
  },
  methods: {
    prompt(questions) {
      this.$refs.appRef.questions = questions;
    },
    registerFormPlugins(formPlugins) {
      console.log(formPlugins);
      if (Array.isArray(formPlugins)) {
        formPlugins.forEach((formPlugin) => {
          this.$refs.appRef.$refs.form.registerPlugin(formPlugin);
        });
      }
    },
  },
  mounted() {
    console.log("sample app is mounted");
    this.registerFormPlugins(plugins);
    this.prompt(questionsArray[0]);
  },
});

let options = {};
app.use(AutoCompletePlugin, options);
plugins.push(options.plugin);

options = {};
app.use(FileBrowserPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(FolderBrowserPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(LabelPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(LoginPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(RadioPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(SingleCheckboxPlugin, options);
plugins.push(options.plugin);

options = {};
app.use(TilesPlugin, options);
plugins.push(options.plugin);

// options = {};
// app.use(DateInputPlugin, options);
// plugins.push(options.plugin);

options = {};
app.use(Form, options);
app.use(options.vuetify ?? vuetify);

export default app.mount("#app");
