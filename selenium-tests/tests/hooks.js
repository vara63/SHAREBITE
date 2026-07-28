const DriverFactory = require("../utilities/driverFactory");
const SeleniumUtils = require("../utilities/seleniumUtils");
const excelReporter = require("../utilities/excelReporter");
const logger = require("../utilities/logger");
const config = require("../config/framework.config");

let globalDriver = null;
let globalUtils = null;
let suiteStartTime = Date.now();

exports.mochaHooks = {
  async beforeAll() {
    logger.info("==================================================================");
    logger.info(" Starting SHAREBITE Enterprise E2E Selenium Test Suite Execution ");
    logger.info("==================================================================");
    suiteStartTime = Date.now();

    try {
      globalDriver = await DriverFactory.createDriver(config.browser, config.headless);
      globalUtils = new SeleniumUtils(globalDriver);
      global.driver = globalDriver;
      global.seleniumUtils = globalUtils;
    } catch (error) {
      logger.error(`Fatal driver creation error: ${error.message}`);
      throw error;
    }
  },

  async beforeEach() {
    this.testStartTime = Date.now();
    const testTitle = this.currentTest ? this.currentTest.fullTitle() : "E2E Test Step";
    logger.info(`>>> RUNNING TEST: [ ${testTitle} ]`);
  },

  async afterEach() {
    const test = this.currentTest;
    const testTitle = test ? test.fullTitle() : "Test Scenario";
    const durationMs = Date.now() - (this.testStartTime || Date.now());
    const durationStr = `${(durationMs / 1000).toFixed(2)}s`;
    const moduleName = test.file ? test.file.split(/[\\/]/).pop().replace(".spec.js", "") : "General";

    let status = "PASSED";
    let failureReason = "";
    let screenshotPath = "N/A";
    let currentUrl = "N/A";

    if (test.state === "failed") {
      status = "FAILED";
      failureReason = test.err ? test.err.message : "Assertion or element timeout failure";

      logger.error(`TEST FAILED: [ ${testTitle} ] - Reason: ${failureReason}`);

      if (globalDriver) {
        try {
          const failureData = await globalUtils.captureFailureDetails(testTitle);
          screenshotPath = failureData.screenshotPath;
          currentUrl = failureData.currentUrl;

          excelReporter.addFailure({
            testName: testTitle,
            failureReason: failureReason,
            screenshotPath: screenshotPath,
            browser: config.browser.toUpperCase(),
            url: currentUrl
          });
        } catch (err) {
          logger.error(`Could not collect failure artifacts: ${err.message}`);
        }
      }
    } else if (test.state === "pending") {
      status = "SKIPPED";
    } else {
      logger.info(`TEST PASSED: [ ${testTitle} ] (${durationStr})`);
    }

    // Record Test Case row for Excel Sheet 2
    excelReporter.addTestCaseResult({
      testId: `TC_${Math.floor(100 + Math.random() * 900)}`,
      module: moduleName.toUpperCase(),
      scenarioName: testTitle,
      browser: config.browser.toUpperCase(),
      status: status,
      startTime: new Date(this.testStartTime || Date.now()).toLocaleTimeString(),
      endTime: new Date().toLocaleTimeString(),
      duration: durationStr
    });

    // Record Execution Log for Excel Sheet 4
    excelReporter.addLog({
      timestamp: new Date().toLocaleString(),
      testName: testTitle,
      stepDescription: `Execution of test step in ${moduleName}`,
      result: status,
      remarks: status === "FAILED" ? `Failed: ${failureReason}` : "Completed successfully"
    });
  },

  async afterAll() {
    const totalDuration = Date.now() - suiteStartTime;

    if (globalDriver) {
      try {
        await globalDriver.quit();
        logger.info("WebDriver instance cleanly closed.");
      } catch (err) {
        logger.error(`Error closing driver: ${err.message}`);
      }
    }

    // Compile Summary for Excel Sheet 1
    const results = excelReporter.results;
    const passedCount = results.filter((r) => r.status === "PASSED").length;
    const failedCount = results.filter((r) => r.status === "FAILED").length;
    const skippedCount = results.filter((r) => r.status === "SKIPPED").length;
    const totalCount = results.length;

    const summary = {
      total: totalCount,
      passed: passedCount,
      failed: failedCount,
      skipped: skippedCount,
      duration: totalDuration
    };

    try {
      await excelReporter.generateExcelReport(summary);
    } catch (err) {
      logger.error(`Error generating Excel report: ${err.message}`);
    }

    logger.info("==================================================================");
    logger.info(` Test Suite Finished. Total: ${totalCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
    logger.info("==================================================================");
  }
};
