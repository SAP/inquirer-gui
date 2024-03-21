/* eslint-disable no-undef */
import { mount, enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";

import NavigatorControl from "../src/NavigatorControl.vue";

enableAutoUnmount(afterEach); //Ensures wrapper component gets cleaned up after each test
describe("Test navigator common control", () => {
  let wrapper;
  let vuetify;

  beforeEach(async () => {
    document.body.setAttribute("data-app", "true");
    vuetify = new createVuetify({
      components,
    });

    const options = {};
    wrapper = mount(NavigatorControl, {
      global: {
        plugins: [vuetify, [options]],
      },
      attachTo: document.body,
    });
    await nextTick();
  });
  test("Navigator Tabs", async () => {
    wrapper.setProps({
      promptIndex: 0,
      prompts: [{ name: "group1" }, { name: "group2" }],
      allAnswers: {
        group1: [
          { label: "akey1", value: "aType" },
          { label: "akey2", value: "a", type: "warning" },
        ],
        group2: [
          { label: "bkey1", value: "bType" },
          { label: "", value: "b" },
        ],
      },
      promptAnswers: {},
      navigationType: "tab",
    });

    await nextTick();
    let items = document.body.querySelectorAll(".v-stepper-item__title");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toEqual("group1");
    expect(items[1].textContent).toEqual("group2");

    let itemSumValues = document.body.querySelectorAll(".NavigatorSummaryValueClass");
    expect(itemSumValues).toHaveLength(3);
    expect(itemSumValues[0].textContent).toEqual("aType");
    expect(itemSumValues[1].textContent).toEqual("bType");
    expect(itemSumValues[2].textContent).toEqual("b");

    let itemWarnings = document.body.querySelectorAll(".NavigatorSummaryWarningValueClass");
    expect(itemWarnings).toHaveLength(1);
    expect(itemWarnings[0].textContent).toEqual("a");

    let itemSumKeys = document.body.querySelectorAll(".NavigatorSummaryKeyClass");
    expect(itemSumKeys).toHaveLength(4);
    expect(itemSumKeys[0].textContent).toEqual("akey1:");
    expect(itemSumKeys[1].textContent).toEqual("akey2:");
    expect(itemSumKeys[2].textContent).toEqual("bkey1:");
    expect(itemSumKeys[3].textContent).toEqual("");

    const confirm = wrapper.find("button");
    confirm.trigger("click");

    wrapper.setProps({
      promptIndex: 1,
      allAnswers: {
        group1: [
          { label: "akey1", value: "aTypeNew" },
          { label: "akey2", value: "aNew" },
        ],
        group2: [
          { label: "bkey1", value: "bType" },
          { label: "", value: "b" },
        ],
      },
    });
    await nextTick();
    itemSumValues = document.body.querySelectorAll(".NavigatorSummaryValueClass");
    expect(itemSumValues).toHaveLength(4);
    expect(itemSumValues[0].textContent).toEqual("aTypeNew");
    expect(itemSumValues[1].textContent).toEqual("aNew");
    expect(itemSumValues[2].textContent).toEqual("bType");
    expect(itemSumValues[3].textContent).toEqual("b");
  });
  test("Navigator Steppers", async () => {
    wrapper.setProps({
      promptIndex: 1,
      prompts: [{ name: "group1" }, { name: "group2" }],
      promptAnswers: {
        promptName: "group1",
        answers: [
          { label: "akey1", value: "aType" },
          { label: "", value: "a" },
        ],
      },
      navigationType: "stepper",
    });

    await nextTick();
    let items = document.body.querySelectorAll(".v-stepper-item__title");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toEqual("group1");
    expect(items[1].textContent).toEqual("group2");

    let itemSumValues = document.body.querySelectorAll(".NavigatorSummaryValueClass");
    expect(itemSumValues).toHaveLength(2);
    expect(itemSumValues[0].textContent).toEqual("aType");
    expect(itemSumValues[1].textContent).toEqual("a");

    let itemSumKeys = document.body.querySelectorAll(".NavigatorSummaryKeyClass");
    expect(itemSumKeys).toHaveLength(2);
    expect(itemSumKeys[0].textContent).toEqual("akey1:");
    expect(itemSumKeys[1].textContent).toEqual("");

    wrapper.setProps({
      promptAnswers: {
        promptName: "group1",
        answers: [
          { label: "akey1", value: "aType" },
          { label: "akey2", value: "a" },
        ],
      },
      navigationType: "stepper",
    });
    await nextTick();
    itemSumKeys = document.body.querySelectorAll(".NavigatorSummaryKeyClass");
    expect(itemSumKeys).toHaveLength(2);
    expect(itemSumKeys[0].textContent).toEqual("akey1:");
    expect(itemSumKeys[1].textContent).toEqual("akey2:");

    const confirm = wrapper.find("button");
    confirm.trigger("click");
    expect(wrapper.emitted().onGotoStep).toBeTruthy();
  });
});
