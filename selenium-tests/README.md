# Enterprise E2E Selenium Automation Framework for SHAREBITE (FoodShare AI)

Production-ready, scalable, maintainable, and enterprise-grade End-to-End (E2E) Selenium WebDriver test automation framework in Node.js built for the **SHAREBITE (FoodShare AI)** React application.

---

## 🏗️ Architecture & Technology Stack

- **Runtime & Language**: Node.js (ES6+ JavaScript)
- **Automation Tool**: Selenium WebDriver (`selenium-webdriver`)
- **Test Runner & Assertions**: Mocha + Chai
- **Design Pattern**: Page Object Model (POM)
- **Reporting Engine**: ExcelJS (4-Sheet `E2E_Report.xlsx`) + Mochawesome HTML Reports
- **Logging**: Winston Logger (`logs/execution.log`, `logs/error.log`)
- **CI/CD Integration**: GitHub Actions Workflow (`.github/workflows/selenium-e2e.yml`)
- **Smart Capability**: Dynamic React Route & Form Validation Discovery (`utilities/routeFormDiscoverer.js`)

---

## 📂 Project Structure

```
selenium-tests/
├── config/
│   ├── framework.config.js       # Central configuration (URLs, Timeouts, Browsers)
│   └── mocha.config.js           # Mocha runner & Mochawesome options
├── data/                         # Test datasets & mock payloads
├── excel/                        # Excel report templates and outputs
├── logs/                         # Winston logger execution & error logs
├── pages/                        # Page Object Model (POM) Classes
│   ├── basePage.js               # Shared base page methods
│   ├── landingPage.js            # Landing page navbar & hero section
│   ├── authPage.js               # Login & Register forms
│   ├── donorDashboardPage.js     # Donor overview, workspace & activity
│   └── receiverDashboardPage.js  # Receiver feed, search, filters & claims
├── reports/                      # Mochawesome HTML & Excel Reports
│   └── failures/                 # Screenshots & console logs captured on test failure
├── screenshots/                  # Captured UI screenshots
├── tests/                        # Mocha Spec Test Suites
│   ├── hooks.js                  # Global setup/teardown & failure handlers
│   ├── auth.spec.js              # Authentication E2E tests
│   ├── forms.spec.js             # Form validation & field rules tests
│   ├── ui-navigation.spec.js     # UI controls, search, filter & history navigation
│   ├── dynamic-discovery.spec.js # Dynamic route & form discovery tests
│   └── e2e-workflow.spec.js      # Complete donor-to-receiver business workflow
├── utilities/
│   ├── driverFactory.js          # Cross-browser (Chrome, Firefox, Edge) factory
│   ├── excelReporter.js          # 4-Sheet Excel report generator via ExcelJS
│   ├── logger.js                 # Winston logger utility
│   ├── routeFormDiscoverer.js    # React AST/Code route & form auto-discovery
│   └── seleniumUtils.js          # Reusable explicit waits, JS execution & alerts
├── package.json
└── README.md
```

---

## 🚀 Execution Instructions

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **Browsers**: Google Chrome / Microsoft Edge / Firefox installed
- Running instance of SHAREBITE frontend (`http://localhost:5173`)

### 2. Install Dependencies
```bash
cd selenium-tests
npm install
```

### 3. Run Test Suites

#### Default Execution (Headless Chrome):
```bash
npm test
```

#### Headed Execution (Browser UI visible):
```bash
npm run test:headed
```

#### Cross-Browser Execution:
```bash
npm run test:chrome   # Run on Google Chrome
npm run test:firefox  # Run on Mozilla Firefox
npm run test:edge     # Run on Microsoft Edge
```

---

## 📊 Reporting Architecture

### 1. ExcelJS Report (`reports/E2E_Report.xlsx`)
Automatically generated after every execution with 4 comprehensive worksheets:
- **Sheet 1: Summary**: Execution Date, Environment, Total, Passed, Failed, Skipped, Pass %, Execution Duration.
- **Sheet 2: Test Cases**: Test ID, Module, Scenario Name, Browser, Status, Start Time, End Time, Duration.
- **Sheet 3: Failed Tests**: Test Name, Failure Reason, Screenshot Path, Browser, URL.
- **Sheet 4: Execution Logs**: Timestamp, Test Name, Step Description, Result, Remarks.

### 2. Mochawesome HTML Report (`reports/mochawesome-report/index.html`)
Interactive HTML report with pass/fail charts, execution timing, stack traces, and failure screenshots.

---

## ⚡ Failure Artifact Collection
Whenever a test fails, the framework automatically captures:
1. High-resolution PNG screenshot saved to `reports/failures/FAIL_<TestName>_<Timestamp>.png`
2. Browser console logs
3. Current page URL
4. Exact failure exception stack trace

---

## 🔄 GitHub Actions CI/CD Pipeline
Continuous Integration is configured in `.github/workflows/selenium-e2e.yml`. On every `push` or `pull_request`, GitHub Actions will:
1. Build the React frontend
2. Start the Vite application preview server
3. Execute the Selenium test suite in Headless mode
4. Generate Excel & Mochawesome HTML reports
5. Upload reports, screenshots, and logs as build artifacts.
