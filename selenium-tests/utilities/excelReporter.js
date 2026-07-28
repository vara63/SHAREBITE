const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const config = require("../config/framework.config");
const logger = require("./logger");

class ExcelReporter {
  constructor() {
    this.results = [];
    this.logs = [];
    this.failures = [];
    this.summaryData = null;
  }

  addTestCaseResult(testResult) {
    // testResult: { testId, module, scenarioName, browser, status, startTime, endTime, duration }
    this.results.push(testResult);
  }

  addFailure(failureDetails) {
    // failureDetails: { testName, failureReason, screenshotPath, browser, url }
    this.failures.push(failureDetails);
  }

  addLog(logItem) {
    // logItem: { timestamp, testName, stepDescription, result, remarks }
    this.logs.push(logItem);
  }

  async generateExcelReport(summary) {
    this.summaryData = summary;

    if (!fs.existsSync(config.paths.reportsDir)) {
      fs.mkdirSync(config.paths.reportsDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "SHAREBITE Automation Architect";
    workbook.created = new Date();

    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E293B" } // Dark slate
    };

    const headerFont = {
      name: "Arial",
      size: 11,
      bold: true,
      color: { argb: "FFFFFF" }
    };

    const borderStyle = {
      top: { style: "thin", color: { argb: "CBD5E1" } },
      left: { style: "thin", color: { argb: "CBD5E1" } },
      bottom: { style: "thin", color: { argb: "CBD5E1" } },
      right: { style: "thin", color: { argb: "CBD5E1" } }
    };

    // -------------------------------------------------------------
    // SHEET 1: SUMMARY
    // -------------------------------------------------------------
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Metric Parameter", key: "param", width: 30 },
      { header: "Value", key: "value", width: 45 }
    ];

    summarySheet.getRow(1).fill = headerFill;
    summarySheet.getRow(1).font = headerFont;

    const passRate = summary.total > 0 ? ((summary.passed / summary.total) * 100).toFixed(2) + "%" : "0.00%";

    const summaryRows = [
      { param: "Execution Date", value: new Date().toLocaleString() },
      { param: "Environment", value: config.baseUrl },
      { param: "Browser Engine", value: config.browser.toUpperCase() },
      { param: "Total Tests Executed", value: summary.total },
      { param: "Passed Tests", value: summary.passed },
      { param: "Failed Tests", value: summary.failed },
      { param: "Skipped Tests", value: summary.skipped },
      { param: "Pass Percentage", value: passRate },
      { param: "Execution Duration (sec)", value: `${(summary.duration / 1000).toFixed(2)}s` }
    ];

    summaryRows.forEach((r) => {
      const row = summarySheet.addRow(r);
      row.border = borderStyle;
    });

    // -------------------------------------------------------------
    // SHEET 2: TEST CASES
    // -------------------------------------------------------------
    const tcSheet = workbook.addWorksheet("Test Cases");
    tcSheet.columns = [
      { header: "Test ID", key: "testId", width: 15 },
      { header: "Module", key: "module", width: 22 },
      { header: "Scenario Name", key: "scenarioName", width: 45 },
      { header: "Browser", key: "browser", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Start Time", key: "startTime", width: 22 },
      { header: "End Time", key: "endTime", width: 22 },
      { header: "Duration", key: "duration", width: 15 }
    ];

    tcSheet.getRow(1).fill = headerFill;
    tcSheet.getRow(1).font = headerFont;

    this.results.forEach((item) => {
      const row = tcSheet.addRow(item);
      row.border = borderStyle;
      const statusCell = row.getCell("status");
      if (item.status === "PASSED") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DCFCE7" } };
        statusCell.font = { color: { argb: "15803D" }, bold: true };
      } else if (item.status === "FAILED") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FEE2E2" } };
        statusCell.font = { color: { argb: "B91C1C" }, bold: true };
      } else {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FEF3C7" } };
        statusCell.font = { color: { argb: "B45309" }, bold: true };
      }
    });

    // -------------------------------------------------------------
    // SHEET 3: FAILED TESTS
    // -------------------------------------------------------------
    const failSheet = workbook.addWorksheet("Failed Tests");
    failSheet.columns = [
      { header: "Test Name", key: "testName", width: 35 },
      { header: "Failure Reason", key: "failureReason", width: 50 },
      { header: "Screenshot Path", key: "screenshotPath", width: 45 },
      { header: "Browser", key: "browser", width: 15 },
      { header: "URL", key: "url", width: 40 }
    ];

    failSheet.getRow(1).fill = headerFill;
    failSheet.getRow(1).font = headerFont;

    this.failures.forEach((item) => {
      const row = failSheet.addRow(item);
      row.border = borderStyle;
    });

    // -------------------------------------------------------------
    // SHEET 4: EXECUTION LOGS
    // -------------------------------------------------------------
    const logSheet = workbook.addWorksheet("Execution Logs");
    logSheet.columns = [
      { header: "Timestamp", key: "timestamp", width: 22 },
      { header: "Test Name", key: "testName", width: 30 },
      { header: "Step Description", key: "stepDescription", width: 50 },
      { header: "Result", key: "result", width: 15 },
      { header: "Remarks", key: "remarks", width: 35 }
    ];

    logSheet.getRow(1).fill = headerFill;
    logSheet.getRow(1).font = headerFont;

    this.logs.forEach((item) => {
      const row = logSheet.addRow(item);
      row.border = borderStyle;
    });

    const reportFile = config.paths.excelReport;
    await workbook.xlsx.writeFile(reportFile);
    logger.info(`Excel E2E Report successfully generated at: ${reportFile}`);
    return reportFile;
  }
}

const reporterInstance = new ExcelReporter();

if (require.main === module) {
  // If executed directly via CLI (e.g. npm run report:excel)
  reporterInstance.addTestCaseResult({
    testId: "TC_101",
    module: "AUTHENTICATION",
    scenarioName: "AUTH_03: Validate successful Donor login",
    browser: "CHROME",
    status: "PASSED",
    startTime: new Date().toLocaleTimeString(),
    endTime: new Date().toLocaleTimeString(),
    duration: "1.45s"
  });

  reporterInstance.addLog({
    timestamp: new Date().toLocaleString(),
    testName: "AUTH_03: Validate successful Donor login",
    stepDescription: "Direct CLI report generation check",
    result: "PASSED",
    remarks: "Baseline Excel report compiled"
  });

  reporterInstance.generateExcelReport({
    total: 1,
    passed: 1,
    failed: 0,
    skipped: 0,
    duration: 1450
  }).catch((err) => console.error(err));
}

module.exports = reporterInstance;

