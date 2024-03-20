<template>
  <v-app id="app">
    <v-row>
      <v-col class="ms-9" cols="3">
        <v-radio-group v-model="navigationType" inline style="margin-top: 10px; margin-bottom: 0px">
          <v-radio label="tab" value="tab"></v-radio>
          <v-radio label="stepper" value="stepper"></v-radio>
        </v-radio-group>
        <v-divider />
        <NavigatorControl
          v-if="navigationType === 'tab'"
          :prompt-index="promptIndex"
          :prompts="prompts"
          :all-answers="allAnswers"
          :prompt-answers="{}"
          navigation-type="tab"
          @on-goto-step="gotoTab"
        />
        <NavigatorControl
          v-if="navigationType === 'stepper'"
          :prompt-index="promptIndex"
          :prompts="prompts"
          :prompt-answers="promptAnswers"
          navigation-type="stepper"
          @on-goto-step="gotoStep"
        />
      </v-col>
      <v-divider class="ms-3" style="margin-right: 20px" inset vertical></v-divider>
      <v-col class="ms-5">
        <div v-if="navigationType === 'stepper'" class="bottom-buttons-col" style="display: flex">
          <v-btn
            v-show="promptIndex > 0"
            id="back"
            variant="elevated"
            :disabled="promptIndex < 1"
            style="min-width: 90px"
            @click="back"
          >
            <v-icon left> mdi-chevron-left </v-icon> Back
          </v-btn>
          <v-btn id="next" style="min-width: 90px" variant="elevated" @click="next">
            Next
            <v-icon right> mdi-chevron-right </v-icon>
          </v-btn>
        </div>
        <v-divider />
        <div v-if="navigationType === 'stepper'" style="margin-top: 20px">Current Step: {{ promptIndex }}</div>
        <div style="margin-top: 20px" v-if="navigationType === 'tab'">
          {{ content }}
        </div>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import "@sap-devx/controls-navigator/dist/navigator-control.css";
import NavigatorControl from "../../../packages/controls-navigator/src/NavigatorControl.vue";

export default {
  name: "app",
  components: { NavigatorControl },
  data() {
    return {
      promptIndex: 0,
      prompts: [{ name: "group1" }, { name: "group2" }, { name: "group3" }],
      allAnswers: {
        group1: [
          { label: "akey1", value: "aType" },
          { label: "akey2", value: "a", type: "warning" },
        ],
        group2: [
          { label: "bkey1", value: "value1" },
          { label: "bkey2", value: "value2" },
        ],
        group3: [
          { label: "bkey1", value: "value1" },
          { label: "bkey2", value: "value2" },
        ],
      },
      promptAnswers: {
        promptName: "group1",
        answers: [
          { label: "akey1", value: "aType" },
          { label: "akey2", value: "a" },
        ],
      },
      navigationType: "tab",
      content: "this is group1 content",
    };
  },
  methods: {
    gotoTab(index) {
      this.content = "this is " + this.prompts[index].name + " content";
    },
    gotoStep(numOfSteps) {
      this.promptIndex -= numOfSteps;
    },
    back() {
      return this.gotoStep(1); // go 1 step back
    },
    next() {
      if (this.promptIndex < this.prompts.length - 1) this.promptIndex++;
    },
  },
  mounted() {},
};
</script>

<style>
.bottom-buttons-col {
  padding: 12px;
  padding-right: 0px;
  margin: auto !important;
}

.bottom-buttons-col > .v-btn:not(:last-child) {
  margin-right: 10px !important;
}
</style>
