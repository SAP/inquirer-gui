import { mount } from "@vue/test-utils";
import Vue from "vue";
import Form from "../src/Form.vue";
import Vuetify from "vuetify";
import QuestionAutocomplete from "../auto-complete-plugin/src/packages/QuestionAutoComplete";
import utils from "./utils";

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
    additionalInfo: () => (lastInput !== "5" ? `${numResults} results returned` : "")
  },
];

const emptyTextQuestion = [
  {
    type: "autocomplete",
    name: "noResultsDefault",
    message: "Type to search1",
    source: () => []
  },
  {
    type: "autocomplete",
    name: "noResultsEmptyText",
    message: "Type to search2",
    source: () => [],
    emptyText: "No results found..."
  },
]

describe("Tests autocomplete question", () => {
  let wrapper;

  beforeEach(async () => {
    const vuetify = new Vuetify({});

    // Prevent warnings
    document.body.setAttribute("data-app", "true");

    Vue.component("QuestionAutocomplete", QuestionAutocomplete);
    await Vue.nextTick();

    wrapper = mount(Form, { vuetify, attachTo: document.body });
    wrapper.vm.registerPlugin({
      questionType: "autocomplete",
      component: QuestionAutocomplete,
    });
  });

  test("Autocomplete return expected results and answer", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });

    await Vue.nextTick();

    expect(
      wrapper
        .findAll(".question-message")
        .at(1)
        .text()
    ).toEqual(autocompleteQuestions[1].message);

    const autocompleteComp = wrapper.findComponent({ name: "QuestionAutocomplete" });
    const searchInput = autocompleteComp.find("input");
    searchInput.element.value = "1";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await utils.sleep(2000);

    // Click to expand results
    searchInput.trigger("click");
    await Vue.nextTick();

    let items = autocompleteComp.findAllComponents({ name: "v-list-item" });
    expect(items).toHaveLength(3);
    expect(items.wrappers[0].element.textContent).toEqual(result1[0]);
    expect(items.wrappers[1].element.textContent).toEqual(result1[1]);
    expect(items.wrappers[2].element.textContent).toEqual(result1[2]);

    // Check that the additinal info is displayed
    let moreInfo = wrapper.find(".moreInfo");
    expect(moreInfo.element.textContent).toEqual("3 results returned");

    // Select an answer
    items.wrappers[2].trigger("click");
    await Vue.nextTick();
    expect(wrapper.vm.getAnswers()).toEqual({ anotherAnswer: "3", autocomplete: "c" });
  });

  test("Autocomplete return expected results with previous answers", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });

    await Vue.nextTick();

    // Provide an answer for question 1 to check for previous answers
    const inputComp = wrapper.findComponent({ name: "QuestionInput" });
    const q1Input = inputComp.find("input");
    q1Input.element.value = "4";
    q1Input.trigger("input");
    await utils.sleep(300);

    const autocompleteComp = wrapper.findComponent({ name: "QuestionAutocomplete" });
    const searchInput = autocompleteComp.find("input");

    searchInput.element.value = "2";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await utils.sleep(2000);

    searchInput.trigger("click");
    await Vue.nextTick();

    const items = autocompleteComp.findAllComponents({ name: "v-list-item" });
    expect(items).toHaveLength(4);
    expect(items.wrappers[0].element.textContent).toEqual(result2[0]);
    expect(items.wrappers[1].element.textContent).toEqual(result2[1]);
    expect(items.wrappers[2].element.textContent).toEqual(result2[2]);
    expect(items.wrappers[3].element.textContent).toEqual(result2[3]);
    const moreInfo = wrapper.find(".moreInfo");
    expect(moreInfo.element.textContent).toEqual("4 results returned");

    // Select an answer
    items.wrappers[3].trigger("click");
    await Vue.nextTick();
    expect(wrapper.vm.getAnswers()).toEqual({ anotherAnswer: "4", autocomplete: "h" });
  });

  test("Check guiOption mandatory is applied", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });
    await Vue.nextTick();
    let mandatoryAsterisk = wrapper.findAll("span.mandatory-asterisk");
    expect(mandatoryAsterisk.length).toEqual(1);
  });

  test("Check additional info is not shown when no additional info string", async () => {
    wrapper.setProps({ questions: autocompleteQuestions });
    await Vue.nextTick();

    const autocompleteComp = wrapper.findComponent({ name: "QuestionAutocomplete" });
    const searchInput = autocompleteComp.find("input");

    // Answer 5 will result in empty additional info string
    searchInput.element.value = "5";
    searchInput.trigger("input");
    // wait to account for debounce + delayed result to mimic backend call
    await utils.sleep(2000);

    searchInput.trigger("click");
    await Vue.nextTick();

    let moreInfo = wrapper.find(".moreInfoBottom");
    expect(moreInfo.exists()).toBe(false);
  });

  test("Empty (no data) text is used if provided", async () => {
    wrapper.setProps({ questions: emptyTextQuestion });
    await Vue.nextTick();

    const autocompleteCompDefault = wrapper.findAllComponents({ name: "QuestionAutocomplete" }).at(0);
    const searchInput1 = autocompleteCompDefault.find("input");
    searchInput1.trigger("click");
    await Vue.nextTick();

    const items1 = autocompleteCompDefault.findAllComponents({ name: "v-list-item" });
    expect(items1.at(0).element.textContent).toEqual('No data available');

    const autocompleteCompEmptyText = wrapper.findAllComponents({ name: "QuestionAutocomplete" }).at(1);
    const searchInput2 = autocompleteCompEmptyText.find("input");
    searchInput2.trigger("click");
    await Vue.nextTick();

    const items2 = autocompleteCompEmptyText.findAllComponents({ name: "v-list-item" });
    expect(items2.at(0).element.textContent).toEqual(emptyTextQuestion[1].emptyText);

  });
});
