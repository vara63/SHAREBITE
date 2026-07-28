const path = require("path");
require("dotenv").config();

const ROOT_DIR = path.resolve(__dirname, "..");

module.exports = {
  // Application URLs
  baseUrl: process.env.BASE_URL || "http://localhost:5173",

  // Browser Execution Options
  browser: process.env.CROSS_BROWSER || process.env.BROWSER || "chrome", // chrome, firefox, edge
  headless: process.env.HEADLESS !== "false", // Default to true in CI/CD, can be overridden by HEADLESS=false

  // Window Resolution
  windowSize: {
    width: 1920,
    height: 1080
  },

  // Timeouts (milliseconds)
  timeouts: {
    implicit: parseInt(process.env.IMPLICIT_WAIT, 10) || 5000,
    explicit: parseInt(process.env.EXPLICIT_WAIT, 10) || 15000,
    pageLoad: parseInt(process.env.PAGE_LOAD_WAIT, 10) || 30000,
    script: parseInt(process.env.SCRIPT_WAIT, 10) || 15000
  },

  // Test Execution Retry Settings
  retries: parseInt(process.env.TEST_RETRIES, 10) || 1,

  // Test Data Credentials (Demographics)
  credentials: {
    donor: {
      email: "donor@foodshare.org",
      password: "Password123!",
      name: "Green Valley Catering",
      location: "Kukatpally, Hyderabad"
    },
    receiver: {
      email: "receiver@foodshare.org",
      password: "Password123!",
      name: "Hope Shelter NGO",
      location: "Ameerpet, Hyderabad"
    },
    invalidUser: {
      email: "wrong.user@foodshare.org",
      password: "WrongPassword999!"
    }
  },

  // Directories & Output Paths
  paths: {
    rootDir: ROOT_DIR,
    reportsDir: path.join(ROOT_DIR, "reports"),
    failuresDir: path.join(ROOT_DIR, "reports", "failures"),
    screenshotsDir: path.join(ROOT_DIR, "screenshots"),
    logsDir: path.join(ROOT_DIR, "logs"),
    excelReport: path.join(ROOT_DIR, "reports", "E2E_Report.xlsx"),
    mochawesomeDir: path.join(ROOT_DIR, "reports", "mochawesome-report")
  }
};
