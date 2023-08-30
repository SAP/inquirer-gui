<template>
  <v-app id="app" class="vscode">
    <v-row>
      <v-col>
        <Form ref="form" :questions="questions" @answered="onAnswered" />
      </v-col>
      <v-col>
        <Answers v-if="this.issues === undefined" :answers="answers" />
        <Issues v-if="this.issues !== undefined" :issues="issues" />
        <div>
          <v-btn :disabled="this.issues !== undefined" @click="onNext">Next</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Answers from "./Answers.vue";
import Issues from "./Issues.vue";

import { RpcBrowser } from "@sap-devx/webview-rpc/out.browser/rpc-browser";
import { RpcBrowserWebSockets } from "@sap-devx/webview-rpc/out.browser/rpc-browser-ws";

export default {
  name: "app",
  components: {
    Answers,
    Issues,
  },
  data() {
    return {
      questions: [],
      issues: {},
      answers: {},
      rpc: {},
    };
  },
  methods: {
    onAnswered(answers, issues) {
      this.answers = answers;
      this.issues = issues;
    },
    onNext() {
      this.$emit("nextSection");
    },
    isInVsCode() {
      return typeof acquireVsCodeApi !== "undefined";
    },
    setupRpc() {
      if (this.isInVsCode()) {
        // eslint-disable-next-line
        window.vscode = acquireVsCodeApi();
        this.rpc = new RpcBrowser(window, window.vscode);
        this.initRpc();
      } else {
        const ws = new WebSocket("ws://127.0.0.1:8081");
        ws.onerror = () => {
          // eslint-disable-next-line
          console.error("ws error");
        };
        ws.onopen = () => {
          this.rpc = new RpcBrowserWebSockets(ws);
          this.initRpc();
        };
      }
    },
    prompt(questions) {
      for (let question of questions) {
        for (let prop in question) {
          if (question[prop] === "__Function") {
            var that = this;
            question[prop] = async (...args) => {
              const response = await that.rpc.invoke("evaluateMethod", [question.name, prop, args]);
              return response;
            };
          }
        }
      }
      this.questions = questions;
    },
    initRpc() {
      const functions = ["prompt"];
      for (let funcName of functions) {
        this.rpc.registerMethod({
          func: this[funcName],
          thisArg: this,
          name: funcName,
        });
      }
      this.rpc.invoke("onClientIsReady", []);
    },
  },
  mounted() {
    this.setupRpc();
    const mutationCallback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          // const isVsCodeLight = mutation.target.classList.contains(
          //   "vscode-light"
          // );
          // if (isVsCodeLight) {
          //   this.$vuetify.theme.light = true;
          // } else {
          //   this.$vuetify.theme.dark = true;
          // }
        }
      }
    };
    const observer = new MutationObserver(mutationCallback);
    const targetNode = document.getElementsByTagName("body")[0];
    observer.observe(targetNode, { attributes: true });
  },
};
</script>

<style>
html,
body {
  height: 100%;
  padding: 0px;
}

.inquirer-gui {
  margin: 8px;
}

.inquirer-gui div.v-field {
  border-radius: 0;
}

.inquirer-gui .v-card.v-card--outlined.v-sheet.theme--light {
  border-radius: 0;
  border-width: medium;
  border-color: black;
}

.inquirer-gui .v-card .v-image__image--cover {
  background-size: contain;
}

div.v-application.v-theme--light {
  background-color: var(--vscode-editor-background, white);
  color: var(--vscode-editor-foreground, black);
}

/* --vscode-focusBorder */

form.inquirer-gui p.question-label {
  color: var(--vscode-panelTitle-activeForeground, black);
}

form.inquirer-gui .v-input .v-input__control .v-field.v-theme--light.v-field--focused {
  border-color: var(--vscode-inputOption-activeBorder, white);
}

form.inquirer-gui .v-input .v-input__control .v-field.v-theme--light {
  background-color: var(--vscode-input-background, darkgray);
}

form.inquirer-gui div.theme--light.v-select {
  color: pink;
}
form.inquirer-gui div.theme--light.v-input input,
form.inquirer-gui div.theme--light.v-input textarea {
  color: var(--vscode-input-foreground, white);
}

form.inquirer-gui .error-validation-text {
  color: brown;
}

form.inquirer-gui .mandatory-asterisk {
  color: red;
}
.inquirer-gui .v-field__input {
  opacity: 1;
}
</style>
