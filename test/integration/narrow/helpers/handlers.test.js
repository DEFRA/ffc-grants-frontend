describe("Get & Post Handlers", () => {
  const varList = {
    planningPermission: "some fake value",
    gridReference: "grid-ref-num",
    businessDetails: "fake business",
    applying: true,
  };

  jest.mock("../../../../app/helpers/page-guard", () => ({
    guardPage: (a, b, c) => false,
  }));

  jest.mock("../../../../app/helpers/urls", () => ({
    getUrl: (a, b, c, d) => "mock-url",
  }));

  jest.mock("../../../../app/helpers/session", () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key];
      else return null;
    },
  }));

  const mockgetGrantValues = jest.fn().mockReturnValue({
    calculatedGrant: "test",
    remainingCost: "test",
  });

  jest.mock("../../../../app/helpers/grants-info", () => ({
    getGrantValues: mockgetGrantValues,
  }));

  jest.mock("../../../../app/services/gapi-service", () => ({
    sendDesirabilitySubmitted: jest.fn().mockReturnValue(true),
  }));

  let question;
  let mockH;

  const { getHandler } = require("../../../../app/helpers/handlers");

  test("is eligible if calculated grant = min grant - whether grant is capped or not", async () => {
    question = {
      url: "mock-url",
      title: "mock-title",
      maybeEligible: true,
      maybeEligibleContent: { reference: "mock-reference" },
    };
    mockH = { redirect: jest.fn() };

    await getHandler(question)({}, mockH);
    expect(mockH.redirect).toHaveBeenCalledWith("/water/start");
  });
  test("getPostHandler", async () => {
    question = {
      baseUrl: "mock-url",
      yarKey: "collaboration",
      title: "mock-title",
      ineligibleContent: true,
      answers: [{ value: "mock-value", key: "collaboration-A1" }],
      nextUrl: "mock-next-url",
      type: "mock-type",
    };
    mockH = { redirect: jest.fn() };
    let mockSet = jest.fn();
    await getPostHandler(question)(
      { payload: { a: "mock-value" }, yar: { set: mockSet } },
      mockH
    );
    expect(mockH.redirect).toHaveBeenCalledWith("mock-url");
  });
});

const { getPostHandler } = require("../../../../app/helpers/handlers");
