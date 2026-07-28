const autocannon = require("autocannon");
const { generateExcelReport } = require("./generate-excel-report");

const targetUrl = process.env.API_URL || "http://localhost:5000/health";
const connections = parseInt(process.env.VIRTUAL_USERS || "100", 10);
const duration = parseInt(process.env.DURATION_SEC || "60", 10);

console.log("================================================================");
console.log(" 🚀 SHAREBITE BASELINE / LOAD TESTING SUITE ");
console.log("================================================================");
console.log(`Target URL:        ${targetUrl}`);
console.log(`Concurrent Users:  ${connections} virtual users`);
console.log(`Test Duration:     ${duration} seconds (1 minute continuous load)`);
console.log("================================================================");
console.log("Starting test execution... Please wait...\n");

const instance = autocannon(
  {
    url: targetUrl,
    connections: connections,
    duration: duration,
    pipelining: 1,
    headers: {
      "content-type": "application/json"
    }
  },
  async (err, result) => {
    if (err) {
      console.error("❌ Baseline Test Error:", err);
      process.exit(1);
    }
    await printResults(result);
  }
);

autocannon.track(instance, { renderProgressBar: true });

async function printResults(result) {
  console.log("\n================================================================");
  console.log(" 📊 BASELINE LOAD TEST RESULTS SUMMARY ");
  console.log("================================================================");
  
  const rpsAvg = result.requests.average.toFixed(2);
  const rpsTotal = result.requests.total;
  const latMin = result.latency.min;
  const latAvg = result.latency.average.toFixed(2);
  const latMax = result.latency.max;
  const latP95 = result.latency.p95;
  const non2xx = result.non2xx || 0;
  const errors = result.errors || 0;

  console.log(`\n1️⃣ REQUESTS PER SECOND (RPS)`);
  console.log(`   • Total Requests Sent:  ${rpsTotal.toLocaleString()} req`);
  console.log(`   • Average Throughput:    ${rpsAvg} req/sec`);
  console.log(`   • Peak Throughput:       ${result.requests.max} req/sec`);

  console.log(`\n2️⃣ RESPONSE TIME (LATENCY)`);
  console.log(`   • Minimum Latency:       ${latMin} ms`);
  console.log(`   • Average Latency:       ${latAvg} ms`);
  console.log(`   • 95th Percentile (p95): ${latP95} ms`);
  console.log(`   • Maximum Latency:       ${latMax} ms`);

  console.log(`\n3️⃣ RELIABILITY & ERRORS`);
  console.log(`   • 2xx Success Responses: ${result["2xx"].toLocaleString()}`);
  console.log(`   • Non-2xx Responses:     ${non2xx}`);
  console.log(`   • Connection Errors:     ${errors}`);

  console.log("\n================================================================");

  if (latAvg < 500 && errors === 0) {
    console.log("✅ RESULT: PASSED - System performance meets baseline SLA specifications (< 500ms avg, 0 errors).");
  } else {
    console.log("⚠️ RESULT: WARNING - System response time or error rate exceeded standard baseline thresholds.");
  }
  console.log("================================================================\n");

  // Automatically generate Excel Report
  try {
    await generateExcelReport(result);
  } catch (excelErr) {
    console.error("Error generating Excel report:", excelErr);
  }
}
