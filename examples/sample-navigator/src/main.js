import { createApp, h } from "vue";
import App from "./App.vue";

import "@sap-devx/controls-navigator/dist/navigator-control.css";
import NavigatorControl from "@sap-devx/controls-navigator";

import vuetify from "./plugins/vuetify";

const app = createApp({
  render: () =>
    h(App, {
      ref: "appRef",
      /*onNextSection: () => {
        if (vm.questionsIndex < questionsArray.length - 1) {
          vm.questionsIndex++;
          vm.prompt(questionsArray[vm.questionsIndex]);
        }
      },*/
    }),
  data() {
    return {};
  },
  methods: {},
  mounted() {
    console.log("sample navigator is mounted");
  },
});

let options = {};

options = {};
app.use(NavigatorControl, options);
app.use(options.vuetify ?? vuetify);

export default app.mount("#app");
