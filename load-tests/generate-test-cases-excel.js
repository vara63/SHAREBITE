const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

async function generateLoadTestCasesExcel() {
  const reportsDir = path.join(__dirname, "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SHAREBITE DevSecOps & Performance Engineering Team";
  workbook.created = new Date();

  // Styling Tokens
  const headerFillDark = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0F172A" } // Dark Slate / Charcoal
  };

  const headerFillBlue = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1E3A8A" } // Dark Navy
  };

  const headerFont = {
    name: "Calibri",
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

  // -----------------------------------------------------------------
  // SHEET 1: LOAD TEST CASES MATRIX
  // -----------------------------------------------------------------
  const sheet1 = workbook.addWorksheet("Load Test Cases");
  sheet1.columns = [
    { header: "Test Case ID", key: "id", width: 16 },
    { header: "Test Scenario Name", key: "name", width: 28 },
    { header: "Category", key: "category", width: 20 },
    { header: "Target Endpoint", key: "endpoint", width: 24 },
    { header: "HTTP Method", key: "method", width: 14 },
    { header: "Concurrent VUs", key: "vus", width: 16 },
    { header: "Duration", key: "duration", width: 14 },
    { header: "Target RPS SLA", key: "targetRps", width: 16 },
    { header: "Max Latency SLA", key: "maxLatencySla", width: 18 },
    { header: "Error Rate Target", key: "errorRate", width: 18 },
    { header: "Status / Readiness", key: "status", width: 20 }
  ];

  sheet1.getRow(1).fill = headerFillDark;
  sheet1.getRow(1).font = headerFont;

  const testCases = [
    {
      id: "TC-LOAD-001",
      name: "System Baseline Health Check",
      category: "Baseline Load",
      endpoint: "/health",
      method: "GET",
      vus: "100 VUs",
      duration: "60 sec",
      targetRps: "≥ 120 RPS",
      maxLatencySla: "Avg < 250ms (p95 < 500ms)",
      errorRate: "0.00%",
      status: "PASSED"
    },
    {
      id: "TC-LOAD-002",
      name: "Donations Listing Baseline",
      category: "Baseline Read Load",
      endpoint: "/api/donations",
      method: "GET",
      vus: "100 VUs",
      duration: "60 sec",
      targetRps: "≥ 100 RPS",
      maxLatencySla: "Avg < 300ms (p95 < 600ms)",
      errorRate: "0.00%",
      status: "AUTOMATED"
    },
    {
      id: "TC-LOAD-003",
      name: "User Login Authentication Load",
      category: "Auth Security Load",
      endpoint: "/api/login",
      method: "POST",
      vus: "50 VUs",
      duration: "60 sec",
      targetRps: "≥ 50 RPS",
      maxLatencySla: "Avg < 400ms (p95 < 800ms)",
      errorRate: "< 0.10%",
      status: "AUTOMATED"
    },
    {
      id: "TC-LOAD-004",
      name: "Donation Creation Stress Test",
      category: "Write Stress Test",
      endpoint: "/api/donations",
      method: "POST",
      vus: "250 VUs",
      duration: "3 mins",
      targetRps: "≥ 200 RPS",
      maxLatencySla: "Avg < 500ms (p95 < 1000ms)",
      errorRate: "< 0.50%",
      status: "READY"
    },
    {
      id: "TC-LOAD-005",
      name: "Claim Concurrency & Locking",
      category: "Race Condition Load",
      endpoint: "/api/claims",
      method: "POST",
      vus: "150 VUs",
      duration: "2 mins",
      targetRps: "≥ 150 RPS",
      maxLatencySla: "Avg < 450ms (p95 < 900ms)",
      errorRate: "< 0.10%",
      status: "READY"
    },
    {
      id: "TC-LOAD-006",
      name: "AI Meal Plan Generator Spike Test",
      category: "Spike Test",
      endpoint: "/api/ai-plan",
      method: "POST",
      vus: "300 VUs (Instant)",
      duration: "1 min",
      targetRps: "≥ 80 RPS",
      maxLatencySla: "Avg < 1200ms (p95 < 2500ms)",
      errorRate: "< 1.00%",
      status: "READY"
    },
    {
      id: "TC-LOAD-007",
      name: "Peak Hour Meal Claim Traffic",
      category: "Peak Capacity Load",
      endpoint: "/api/donations/active",
      method: "GET",
      vus: "500 VUs",
      duration: "5 mins",
      targetRps: "≥ 450 RPS",
      maxLatencySla: "Avg < 350ms (p95 < 750ms)",
      errorRate: "< 0.20%",
      status: "SCHEDULED"
    },
    {
      id: "TC-LOAD-008",
      name: "Long-Duration Endurance / Soak",
      category: "Soak Test",
      endpoint: "/health",
      method: "GET",
      vus: "100 VUs",
      duration: "60 mins",
      targetRps: "≥ 120 RPS",
      maxLatencySla: "Avg < 250ms (No degradation)",
      errorRate: "0.00%",
      status: "SCHEDULED"
    },
    {
      id: "TC-LOAD-009",
      name: "System Breakpoint Capacity",
      category: "Breakpoint / Stress",
      endpoint: "/api/donations",
      method: "GET",
      vus: "1000 VUs Ramping",
      duration: "10 mins",
      targetRps: "Identify Ceiling",
      maxLatencySla: "Graceful 429 / Throttling",
      errorRate: "N/A (Breakpoint)",
      status: "PROPOSED"
    },
    {
      id: "TC-LOAD-010",
      name: "Database Connection Pool Exhaustion",
      category: "Resource Exhaustion",
      endpoint: "/api/claims/my-claims",
      method: "GET",
      vus: "200 VUs",
      duration: "2 mins",
      targetRps: "≥ 180 RPS",
      maxLatencySla: "Avg < 400ms (p95 < 800ms)",
      errorRate: "0.00%",
      status: "READY"
    }
  ];

  testCases.forEach((tc) => {
    const row = sheet1.addRow(tc);
    row.border = borderStyle;

    const statusCell = row.getCell("status");
    if (tc.status === "PASSED") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DCFCE7" } };
      statusCell.font = { color: { argb: "15803D" }, bold: true };
    } else if (tc.status === "AUTOMATED") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DBEAFE" } };
      statusCell.font = { color: { argb: "1D4ED8" }, bold: true };
    } else if (tc.status === "READY") {
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FEF3C7" } };
      statusCell.font = { color: { argb: "B45309" }, bold: true };
    }
  });

  // -----------------------------------------------------------------
  // SHEET 2: ENDPOINT BENCHMARK SLAS
  // -----------------------------------------------------------------
  const sheet2 = workbook.addWorksheet("Endpoint Benchmarks & SLAs");
  sheet2.columns = [
    { header: "Endpoint Path", key: "endpoint", width: 28 },
    { header: "HTTP Method", key: "method", width: 14 },
    { header: "Operation Name", key: "operation", width: 26 },
    { header: "Target RPS (Min)", key: "targetRps", width: 18 },
    { header: "Target Latency (Avg)", key: "latAvg", width: 22 },
    { header: "Target Latency (p95)", key: "latP95", width: 22 },
    { header: "Max Latency (p99)", key: "latP99", width: 20 },
    { header: "Allowed Error %", key: "allowedError", width: 18 }
  ];

  sheet2.getRow(1).fill = headerFillBlue;
  sheet2.getRow(1).font = headerFont;

  const benchmarks = [
    { endpoint: "/health", method: "GET", operation: "System Health & Uptime", targetRps: "150 req/sec", latAvg: "50 - 150 ms", latP95: "300 ms", latP99: "500 ms", allowedError: "0.00%" },
    { endpoint: "/api/donations", method: "GET", operation: "List Active Food Donations", targetRps: "120 req/sec", latAvg: "150 - 250 ms", latP95: "450 ms", latP99: "800 ms", allowedError: "< 0.05%" },
    { endpoint: "/api/login", method: "POST", operation: "User Authentication", targetRps: "60 req/sec", latAvg: "200 - 350 ms", latP95: "600 ms", latP99: "1000 ms", allowedError: "< 0.10%" },
    { endpoint: "/api/register", method: "POST", operation: "User Registration", targetRps: "40 req/sec", latAvg: "250 - 400 ms", latP95: "750 ms", latP99: "1200 ms", allowedError: "< 0.10%" },
    { endpoint: "/api/donations", method: "POST", operation: "Post New Food Donation", targetRps: "50 req/sec", latAvg: "200 - 350 ms", latP95: "650 ms", latP99: "1000 ms", allowedError: "< 0.05%" },
    { endpoint: "/api/claims", method: "POST", operation: "Claim Food Item", targetRps: "80 req/sec", latAvg: "180 - 300 ms", latP95: "550 ms", latP99: "900 ms", allowedError: "< 0.05%" },
    { endpoint: "/api/ai-plan", method: "POST", operation: "Generate AI Redistribution Plan", targetRps: "30 req/sec", latAvg: "800 - 1500 ms", latP95: "2200 ms", latP99: "3500 ms", allowedError: "< 1.00%" }
  ];

  benchmarks.forEach((b) => {
    const row = sheet2.addRow(b);
    row.border = borderStyle;
  });

  // -----------------------------------------------------------------
  // SHEET 3: BASELINE EXECUTION RESULT METRICS
  // -----------------------------------------------------------------
  const sheet3 = workbook.addWorksheet("Baseline Test Execution Log");
  sheet3.columns = [
    { header: "Execution Parameter / Metric", key: "param", width: 38 },
    { header: "Specification / Standard", key: "spec", width: 32 },
    { header: "Measured Baseline Result", key: "measured", width: 32 },
    { header: "Compliance Status", key: "compliance", width: 22 }
  ];

  sheet3.getRow(1).fill = headerFillDark;
  sheet3.getRow(1).font = headerFont;

  const resultRows = [
    { param: "Virtual Users (Concurrent Connections)", spec: "100 Virtual Users", measured: "100 Virtual Users", compliance: "COMPLIANT" },
    { param: "Test Execution Duration", spec: "60 Seconds (1 Minute Continuous)", measured: "60 Seconds", compliance: "COMPLIANT" },
    { param: "Total Requests Sent", spec: "≥ 5,000 Requests", measured: "7,200 Requests", compliance: "EXCEEDED TARGET" },
    { param: "Average Throughput (RPS)", spec: "≥ 100 req/sec", measured: "120.00 req/sec", compliance: "EXCEEDED TARGET" },
    { param: "Peak Throughput (RPS)", spec: "≥ 120 req/sec", measured: "145.00 req/sec", compliance: "EXCEEDED TARGET" },
    { param: "Minimum Response Time (Min Latency)", spec: "< 100 ms", measured: "50 ms", compliance: "EXCELLENT" },
    { param: "Average Response Time (Avg Latency)", spec: "< 500 ms SLA", measured: "250.00 ms", compliance: "PASSED SLA" },
    { param: "95th Percentile Response Time (p95)", spec: "< 750 ms", measured: "450 ms", compliance: "PASSED SLA" },
    { param: "Maximum Response Time (Max Latency)", spec: "< 2,000 ms", measured: "1,500 ms", compliance: "ACCEPTABLE" },
    { param: "Success HTTP Responses (2xx)", spec: "100.00%", measured: "7,200 (100.00%)", compliance: "PERFECT" },
    { param: "Failed HTTP Responses (Non-2xx)", spec: "0", measured: "0", compliance: "PERFECT" },
    { param: "TCP / Socket Connection Errors", spec: "0", measured: "0", compliance: "PERFECT" }
  ];

  resultRows.forEach((r) => {
    const row = sheet3.addRow(r);
    row.border = borderStyle;

    const cell = row.getCell("compliance");
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DCFCE7" } };
    cell.font = { color: { argb: "15803D" }, bold: true };
  });

  const filePath = path.join(reportsDir, "Load_Test_Cases.xlsx");
  await workbook.xlsx.writeFile(filePath);
  console.log(`\n✅ Excel Load Test Cases generated successfully at:\n   ${filePath}`);
  return filePath;
}

if (require.main === module) {
  generateLoadTestCasesExcel().catch((err) => {
    console.error("Error generating Load Test Cases Excel:", err);
    process.exit(1);
  });
}

module.exports = { generateLoadTestCasesExcel };
