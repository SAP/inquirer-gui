<template>
  <v-app id="app" class="vscode">
    <v-row>
      <v-col>
        <Form ref="form" :questions="questions" @answered="onAnswered" />
      </v-col>
      <v-col>
        <Answers v-if="this.allValid" :answers="answers" />
        <h1 class="text-danger" v-if="!this.allValid">Some answers are invalid</h1>
        <div>
          <v-btn
            v-bind:disabled="!allValid"
            v-bind:class="{'btn-success': allValid, 'btn-danger': !allValid}"
          >Next</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Vue from "vue";
import Answers from "./Answers.vue";

import { RpcBrowser } from "@sap-devx/webview-rpc/out.browser/rpc-browser";
import { RpcBrowserWebSockets } from "@sap-devx/webview-rpc/out.browser/rpc-browser-ws";

export default {
  name: "app",
  components: {
    Answers
  },
  data() {
    return {
      questions: [],
      allValid: false,
      answers: {},
      rpc: {}
    };
  },
  methods: {
    onAnswered(answers, allValid) {
      this.answers = answers;
      this.allValid = allValid;
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
            console.debug(`${question.name}.${prop}() is a function`);
            var that = this;
            question[prop] = async (...args) => {
              const response = await that.rpc.invoke("evaluateMethod", [
                question.name,
                prop,
                args
              ]);
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
          name: funcName
        });
      }
      this.rpc.invoke("onClientIsReady", []);
    }
  },
  watch: {
    "questions.answers": {
      handler(val) {
        console.log(val);
      }
    }
  },
  mounted() {
    this.setupRpc();
    const mutationCallback = mutationsList => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isVsCodeLight = mutation.target.classList.contains(
            "vscode-light"
          );
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
  }
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

.v-application.theme--light div.inquirer-gui p.question-label {
  color: var(--vscode-editor-foreground, darkgray);
}

div.theme--light.v-input input::placeholder {
  color: var(--vscode-input-placeholderForeground, gray);
}

div.inquirer-gui div.theme--light.v-input input {
  color: var(--vscode-input-foreground, black);
}
</style>
