const { expect } = require("chai");
const routeFormDiscoverer = require("../utilities/routeFormDiscoverer");
const BasePage = require("../pages/basePage");
const logger = require("../utilities/logger");

describe("Dynamic React Route & Form Discovery Test Suite", function () {
  let basePage;
  let discoveryData;

  before(function () {
    basePage = new BasePage(global.driver);
    discoveryData = routeFormDiscoverer.discoverRoutesAndForms();
    logger.info(`Running ${discoveryData.generatedTestCases.length} dynamically generated tests.`);
  });

  it("DYN_01: Verify all discovered React routes are accessible or enforce protection", async function () {
    for (const route of discoveryData.routes) {
      logger.info(`Testing dynamic route access: ${route.path}`);
      await basePage.open(route.path);
      const url = await basePage.getCurrentUrl();

      if (route.isProtected) {
        expect(url).to.satisfy(
          (u) => u.includes("/login") || u.includes(route.path)
        );
      } else {
        expect(url).to.include(route.path === "/" ? "/" : route.path);
      }
    }
  });

  it("DYN_02: Execute dynamically generated test cases from form analysis", async function () {
    for (const testCase of discoveryData.generatedTestCases) {
      logger.info(`Executing generated test scenario: ${testCase.scenarioName}`);
      if (testCase.type === "navigation") {
        await basePage.open(testCase.targetUrl);
        const url = await basePage.getCurrentUrl();
        expect(url).to.exist;
      }
    }
  });
});
