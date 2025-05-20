/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import FormVue from "../../inquirer-gui/src/Form.vue";

import QuestionAutoCompletePlugin from "../../auto-complete-plugin/src";
// import QuestionAutoCompletePlugin from "@sap-devx/inquirer-gui-auto-complete-plugin";
import utils from "../../inquirer-gui/__tests__/utils";
import autoCompleteUtils from "../src/utils";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

let numResults = 0;
const result1 = ["a", "b", "c"];
const result2 = ["e", "f", "g", "h"];
const result5 = ["i"];
let lastInput = "";
const autocompleteQuestions = [
  {
    type: "input",
    name: "anotherAnswer",
    message: "Another question",
    default: "3",
  },
  {
    type: "autocomplete",
    name: "autocomplete",
    message: "Type to search",
    source: async (previousAnswers, input) => {
      let result;
      if (input === "1") {
        result = result1;
      }
      if (input === "2" && previousAnswers?.anotherAnswer === "4") {
        result = result2;
      }
      if (input === "5") {
        result = result5;
      }
      await utils.sleep(1000);
      numResults = result.length;
      lastInput = input;
      return result;
    },
    additionalInfo: () => (lastInput !== "5" ? `${numResults} results returned` : ""),
  },
];

const emptyTextQuestion = [
  {
    type: "autocomplete",
    name: "noResultsDefault",
    message: "Type to search1",
    source: () => [],
  },
  {
    type: "autocomplete",
    name: "noResultsEmptyText",
    message: "Type to search2",
    source: () => [],
    emptyText: "No results found...",
  },
];
const vscodeStubs = {
  "vscode-textfield": {
    template: `
      <div>
        <input
          type="text"
          :value="value"
          :placeholder="placeholder"
          @input="$emit('update:value', $event.target.value)"
          @change="$emit('change', $event)"
        />
        <slot></slot>
      </div>
    `,
    props: ["value", "placeholder"],
  },
  "vscode-divider": {
    template: "<div></div>",
  },
};
enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Tests autocomplete question", () => {
  let wrapper;
  let vuetify;

  beforeEach(async () => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });

    const options = {};
    wrapper = mount(FormVue, {
      global: {
        plugins: [vuetify, [QuestionAutoCompletePlugin, options]],
        stubs: vscodeStubs,
      },
      attachTo: document.body,
    });
    await nextTick();

    wrapper.vm.registerPlugin(options.plugin);
  });

  test("Autocomplete return expected results and answer", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });

    await nextTick();

    expect(wrapper.findAll(".question-message").at(1).text()).toEqual(autocompleteQuestions[1].message);

    const autocompleteComp = wrapper.findComponent({
      name: "QuestionAutocomplete",
    });
    const searchInput = autocompleteComp.find("input");
    searchInput.element.value = "1";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await nextTick();
    await utils.sleep(2000);

    // Click to expand results
    searchInput.trigger("mousedown");
    await nextTick();
    let items = document.body.querySelectorAll(".v-list-item");

    expect(items).toHaveLength(3);
    expect(items[0].textContent).toEqual(result1[0]);
    expect(items[1].textContent).toEqual(result1[1]);
    expect(items[2].textContent).toEqual(result1[2]);

    // Check that the additinal info is displayed
    let moreInfo = document.body.querySelector(".moreInfo");
    expect(moreInfo.textContent).toEqual("3 results returned");

    // Select an answer
    items[2].dispatchEvent(new Event("click"));
    await nextTick();
    expect(wrapper.vm.getAnswers()).toEqual({
      anotherAnswer: "3",
      autocomplete: "c",
    });
  });

  test("Autocomplete return expected results with previous answers", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });

    await nextTick();

    // Provide an answer for question 1 to check for previous answers
    const inputComp = wrapper.findComponent({ name: "QuestionInput" });
    const q1Input = inputComp.find("input");
    q1Input.element.value = "4";
    q1Input.trigger("change");
    await utils.sleep(300);

    const autocompleteComp = wrapper.findComponent({
      name: "QuestionAutocomplete",
    });
    const searchInput = autocompleteComp.find("input");

    searchInput.element.value = "2";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await nextTick();
    await utils.sleep(2000);

    searchInput.trigger("mousedown");
    await nextTick();

    const items = document.body.querySelectorAll(".v-list-item");
    expect(items).toHaveLength(4);
    expect(items[0].textContent).toEqual(result2[0]);
    expect(items[1].textContent).toEqual(result2[1]);
    expect(items[2].textContent).toEqual(result2[2]);
    expect(items[3].textContent).toEqual(result2[3]);
    const moreInfo = document.body.querySelector(".moreInfo");
    expect(moreInfo.textContent).toEqual("4 results returned");

    // Select an answer
    items[3].dispatchEvent(new Event("click"));
    await nextTick();
    expect(wrapper.vm.getAnswers()).toEqual({
      anotherAnswer: "4",
      autocomplete: "h",
    });
  });

  test("Check guiOption mandatory is applied", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });
    await nextTick();
    let mandatoryAsterisk = wrapper.findAll("span.mandatory-asterisk");
    expect(mandatoryAsterisk.length).toEqual(1);
  });

  test("Check additional info is not shown when no additional info string", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });
    await nextTick();

    const autocompleteComp = wrapper.findComponent({
      name: "QuestionAutocomplete",
    });
    const searchInput = autocompleteComp.find("input");

    // Answer 5 will result in empty additional info string
    searchInput.element.value = "5";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await utils.sleep(2000);

    searchInput.trigger("click");
    await nextTick();

    let moreInfo = wrapper.find(".moreInfoBottom");
    expect(moreInfo.exists()).toBe(false);
  });

  test("Empty (no data) text is used if provided", async () => {
    wrapper.setProps({ questions: emptyTextQuestion });
    await nextTick();

    const autocompleteCompDefault = wrapper.findAllComponents({ name: "QuestionAutocomplete" }).at(0);
    const searchInput1 = autocompleteCompDefault.find("input");
    searchInput1.trigger("mousedown");
    await nextTick();

    const items1 = document.body.querySelectorAll(".v-list-item");
    expect(items1[0].textContent).toEqual("No data available");

    const autocompleteCompEmptyText = wrapper.findAllComponents({ name: "QuestionAutocomplete" }).at(1);
    const searchInput2 = autocompleteCompEmptyText.find("input");
    searchInput2.trigger("mousedown");
    await nextTick();

    const items2 = document.body.querySelectorAll(".v-list-item");
    expect(items2[1].textContent).toEqual(emptyTextQuestion[1].emptyText);
  });

  test("should assign value to name when only name exists", () => {
    const input = [{ name: "Option A" }];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([{ name: "Option A", value: "Option A" }]);
  });

  test("should keep objects unchanged if they have both name and value properties", () => {
    const input = [{ name: "Option A", value: "A" }];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([{ name: "Option A", value: "A" }]);
  });

  test("should keep objects unchanged if they have neither name nor value", () => {
    const input = [{ id: 1 }];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([{ id: 1 }]);
  });

  test("should return correct format for string and number values", () => {
    const input = ["Option A", 42, undefined];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([
      { name: "Option A", value: "Option A" },
      { name: 42, value: 42 },
      { name: undefined, value: undefined },
    ]);
  });

  test("should return undefined if input is not an array", () => {
    const output = autoCompleteUtils.normalizeChoices("not an array");
    expect(output).toBeUndefined();
  });

  test("should return correct format for number values", () => {
    const input = [42];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([{ name: 42, value: 42 }]);
  });

  test("should return correct format for mixed values including numbers", () => {
    const input = ["Option A", 42, { name: "Option B" }];
    const output = autoCompleteUtils.normalizeChoices(input);
    expect(output).toEqual([
      { name: "Option A", value: "Option A" },
      { name: 42, value: 42 },
      { name: "Option B", value: "Option B" },
    ]);
  });

  test("should handle values that are neither undefined, string, or number", () => {
    const output = autoCompleteUtils.normalizeChoices([true]);
    expect(output).toEqual([true]);
  });
});
