/* eslint-disable no-undef */
import utils from "../src/utils";

describe("normalizeChoices", () => {
  test("should assign value to name when only name exists", () => {
    const input = [{ name: "Option A" }];
    const output = utils.normalizeChoices(input);
    expect(output).toEqual([{ name: "Option A", value: "Option A" }]);
  });

  test("should keep objects unchanged if they have both name and value properties", () => {
    const input = [{ name: "Option A", value: "A" }];
    const output = utils.normalizeChoices(input);
    expect(output).toEqual([{ name: "Option A", value: "A" }]);
  });

  test("should keep objects unchanged if they have neither name nor value", () => {
    const input = [{ id: 1 }];
    const output = utils.normalizeChoices(input);
    expect(output).toEqual([{ id: 1 }]);
  });

  test("should return correct format for string and number values", () => {
    const input = ["Option A", 42, undefined];
    const output = utils.normalizeChoices(input);
    expect(output).toEqual([
      { name: "Option A", value: "Option A" },
      { name: 42, value: 42 },
      { name: undefined, value: undefined },
    ]);
  });

  test("should return undefined if input is not an array", () => {
    const output = utils.normalizeChoices("not an array");
    expect(output).toBeUndefined();
  });
});
