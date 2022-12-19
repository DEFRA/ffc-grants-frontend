const {
  setOptionsLabel,
} = require("../../../../app/helpers/answer-options");
describe("answer-options", () => {
  test("check setOptionsLabel()", () => {
    const answers = [
      { value: "divider" },
      { value: "mock-data", hint: "mock-hint" },
      {
        value: "another-mock-data",
        hint: "mock-hint",
        conditional: "mock-cond",
      },
      {
        value: "another-mock-data",
        hint: "mock-hint",
        conditional: "mock-cond",
        text: "mock-text",
      },
    ];
    expect(setOptionsLabel("mock-data", answers, "cond-html")).toEqual([
      { divider: "or" },
      {
        value: "mock-data",
        text: "mock-data",
        hint: "mock-hint",
        checked: true,
        selected: true,
      },
      {
        value: "another-mock-data",
        text: "another-mock-data",
        conditional: { html: "cond-html" },
        hint: "mock-hint",
        checked: false,
        selected: false,
      },
      {
        value: "another-mock-data",
        text: "mock-text",
        conditional: "mock-cond",
        hint: "mock-hint",
        checked: false,
        selected: false,
      },
    ]);
  });
});
