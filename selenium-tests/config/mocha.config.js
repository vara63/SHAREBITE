const path = require("path");
const config = require("./framework.config");

module.exports = {
  spec: [
    "tests/auth.spec.js",
    "tests/forms.spec.js",
    "tests/ui-navigation.spec.js",
    "tests/dynamic-discovery.spec.js",
    "tests/e2e-workflow.spec.js"
  ],
  file: ["tests/hooks.js"],
  timeout: 60000, // 60 seconds per test
  retries: config.retries,
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: config.paths.mochawesomeDir,
    reportFilename: "index",
    quiet: true,
    json: true,
    html: true,
    overwrite: true,
    inlineAssets: true,
    reportTitle: "SHAREBITE (FoodShare AI) E2E Automation Report"
  }
};
