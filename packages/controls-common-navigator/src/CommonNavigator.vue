<template>
  <div :class="getNavigateClass()">
    <v-stepper :model-value="currentStep - 1">
      <template v-for="index in steps" :key="index">
        <v-stepper-item
          :editable="navigationType === 'tab' || currentStep > index"
          :title="prompts[index - 1] ? prompts[index - 1].name : ''"
          :complete="getComplete(index)"
          :class="getStepClass(currentStep, index)"
          @click="gotoStep(index)"
        />
        <div class="breadcrumbs-container">
          <YOUIBreadcrumbs
            :id="`breadcrumbs-${index}`"
            class="breadcrumbs"
            :breadcrumbs="answers[prompts[index - 1] ? prompts[index - 1].name : undefined]"
          />
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, unref, watchEffect } from "vue";
import YOUIBreadcrumbs from "./YOUIBreadcrumbs.vue";
import * as _ from "lodash";
const props = defineProps({
  promptIndex: {
    type: Number,
    default: 0,
  },
  prompts: {
    type: Array,
    default: () => [],
  },
  promptAnswers: {
    type: Object,
    default: () => {},
  },
  allAnswers: {
    type: Object,
    default: () => {},
  },
  navigationType: {
    type: String,
    default: "tab",
  },
});

const { promptIndex, prompts, allAnswers, promptAnswers, navigationType } = toRefs(props);

const emits = defineEmits(["onGotoStep"]);

const answers = ref({});

const currentStep = ref(0);

const travel = ref({});

const steps = computed(() => {
  return unref(prompts).length;
});

watchEffect(() => {
  currentStep.value = unref(promptIndex) + 1;
});

watchEffect(() => {
  const count = unref(prompts).length;
  for (let i = 0; i < count; i++) {
    travel.value[i + 1] = false;
  }
});

watchEffect(() => {
  if (unref(promptAnswers) && unref(promptAnswers).promptName && unref(promptAnswers).answers) {
    // Vue 2 requires a new object for reactivity to trigger updates
    answers.value = Object.assign({}, unref(answers), {
      [unref(promptAnswers).promptName]: unref(promptAnswers).answers,
    });
  }
});
watchEffect(() => {
  if (unref(allAnswers) && !_.isEmpty(unref(allAnswers))) {
    // Vue 2 requires a new object for reactivity to trigger updates
    answers.value = Object.assign({}, unref(answers), unref(allAnswers));
  }
});
const getStepClass = (currentStep, index) => {
  return {
    "step-linkable": navigationType.value === "tab" ? true : currentStep > index,
  };
};
const gotoStep = (index) => {
  if (navigationType.value === "tab") {
    currentStep.value = index;
    emits("onGotoStep", index - 1);
  } else {
    // numOfSteps is number of steps to go back
    const numOfSteps = currentStep.value - index;
    if (numOfSteps > 0) {
      emits("onGotoStep", numOfSteps);
    }
  }
};
const isTraveled = (index) => {
  travel.value[currentStep.value] = true;
  return index !== currentStep.value && !!travel.value[index];
};
const getNavigateClass = () => {
  return navigationType.value === "tab" ? "PTNavigationTabClass" : "PTNavigationStepperClass";
};
const getComplete = (index) => {
  // numOfSteps is number of steps to go back
  if (navigationType.value === "tab") {
    return isTraveled(index);
  }
  return currentStep.value > index;
};

defineExpose({
  gotoStep,
  steps,
  currentStep,
  getStepClass,
});
</script>

<style lang="scss">
div.PTNavigationTabClass {
  div.v-stepper .v-stepper-item {
    padding-left: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    opacity: 1 !important;
    /* Step bullet  */
    .v-stepper-item__avatar {
      font-size: 0px;

      background-color: var(
        --vscode-editor-background,
        white
      ) !important; // Override Vuetifys theme specific selector `.theme--dark.v-stepper .v-stepper__step:not(.v-stepper__step--active):not(.v-stepper__step--complete):not(.v-stepper__step--error) .v-stepper__step__step`

      //background-color: transparent !important; // Required since  Vuetify `.v-application .primary` adds background-color !important
      color: var(--vscode-foreground, #616161);
      border: 1px solid;
      height: 10px !important;
      width: 10px !important;
      min-width: 10px;
      margin-right: 10px;
      transition: 0.3s ease-in-out;
      .v-icon.v-icon {
        font-size: 0;
      }
    }
    /* Step label */
    .v-stepper-item__title {
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: var(
        --vscode-foreground,
        #616161
      ) !important; // Required since Vuetify adds inline color for selector: `.theme--dark.v-stepper .v-stepper__label`
      transition: 0.3s ease-in-out;
    }
    &--complete {
      .v-stepper-item__avatar {
        background-color: var(--vscode-foreground, #616161) !important;
        border-color: var(
          --vscode-foreground,
          #616161
        ) !important; // Required since Vuetify adds border-color !important for selector `.v-application .primary`
      }
    }
    &--selected {
      .v-stepper-item__title {
        color: var(
          --vscode-pickerGroup-foreground,
          #0066bf
        ) !important; // Required since Vuetify adds inline color for selector: `.theme--dark.v-stepper .v-stepper__label`
        transition: 0.3s ease-in-out;
      }
      .v-stepper-item__avatar {
        background-color: var(--vscode-pickerGroup-foreground, #0066bf) !important;
        border-color: var(
          --vscode-pickerGroup-foreground,
          #0066bf
        ) !important; // Required since Vuetify adds border-color !important for selector `.v-application .primary`
      }
    }
  }
}

div.PTNavigationStepperClass {
  div.v-stepper .v-stepper-item {
    padding-left: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    opacity: 0.4;
    /* Step bullet  */
    .v-stepper-item__avatar {
      font-size: 0px;
      background-color: transparent !important; // Required since  Vuetify `.v-application .primary` adds background-color !important
      color: var(--vscode-editor-foreground, #616161);
      border: 1px solid;
      height: 10px !important;
      width: 10px !important;
      min-width: 10px;
      margin-right: 10px;
      transition: 0.3s ease-in-out;
      .v-icon.v-icon {
        font-size: 0;
      }
    }
    /* Step label */
    .v-stepper-item__title {
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      color: var(
        --vscode-editor-foreground,
        #616161
      ) !important; // Required since Vuetify adds inline color for selector: `.theme--dark.v-stepper .v-stepper__label`
      transition: 0.3s ease-in-out;
      text-align: left;
    }
    &--complete {
      opacity: unset !important; // Overrides the default opacity of .v-stepper-item in case of complete step
      .v-stepper-item__title {
        color: var(
          --vscode-textLink-foreground,
          #3794ff
        ) !important; // Override Vuetifys theme specific selectors `.theme--dark.v-stepper .v-stepper__step--complete .v-stepper__label`
        text-decoration-line: underline;
        cursor: pointer;
        &:hover {
          text-decoration-line: none;
        }
      }
      .v-stepper-item__avatar {
        background-color: var(
          --vscode-textLink-foreground,
          #3794ff
        ) !important; // Required since Vuetify adds background-color !important for selector `.v-application .primary`
        border: none;
      }
    }
    &--selected {
      opacity: 1 !important; // Overrides the default opacity of .v-stepper-item in case of selected step
      .v-stepper-item__avatar {
        background-color: transparent !important;
        border-color: var(
          --vscode-editor-foreground,
          #616161
        ) !important; // Required since Vuetify adds border-color !important for selector `.v-application .primary`
      }
    }
  }
}
div.v-application {
  div.v-stepper {
    background-color: var(--vscode-editor-background, white);
    box-shadow: none;
    padding-top: 10px;
    .breadcrumbs-container {
      margin-left: 5px;
      margin-bottom: 0px;
      margin-top: 0px;
      padding-top: 0px;
      padding-bottom: 20px;
      padding-left: 16px;
      transition: none;
      &:not(:last-child) {
        border-left: 1px solid var(--vscode-editorWidget-border, #c8c8c8);
        transition: none;
      }
      &:last-child {
        padding-left: 17px; // Adjust for border-left
      }
      .v-stepper__wrapper {
        height: auto !important; // Override inline height: 0px for complete and inactive steps.
        transition: none;
      }
      .breadcrumbs {
        transition: max-height 0.3s ease-in-out;
      }
    }
  }
}
</style>
