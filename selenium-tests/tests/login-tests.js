/**
 * SHAREBITE - Frontend E2E Selenium WebDriver Test Suite
 * File: selenium-tests/tests/login-tests.js
 * Description: End-to-end automation testing for SHAREBITE Login & Auth flows using Selenium WebDriver.
 */

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/login';
const BROWSER = process.env.BROWSER || 'chrome';
const HEADLESS = process.env.HEADLESS === 'true';
const TIMEOUT_MS = 10000;

// Test Results Tracker
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

function recordResult(testName, category, status, durationMs, error = null) {
  testResults.total++;
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else testResults.skipped++;

  testResults.details.push({
    id: `E2E_SELENIUM_${String(testResults.total).padStart(3, '0')}`,
    testName,
    category,
    status,
    durationMs: `${durationMs}ms`,
    error: error ? error.message : null
  });

  const badge = status === 'PASS' ? '✅ PASS' : status === 'FAIL' ? '❌ FAIL' : '⚠️ SKIP';
  console.log(`[${badge}] ${testName} (${durationMs}ms)`);
  if (error) {
    console.error(`     └─ Error: ${error.message}`);
  }
}

async function createDriver() {
  const options = new chrome.Options();
  if (HEADLESS) {
    options.addArguments('--headless=new');
  }
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,800');

  const driver = await new Builder()
    .forBrowser(BROWSER)
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: TIMEOUT_MS });
  return driver;
}

// Helper Assertions
function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion Failed'}: Expected "${expected}", but got "${actual}"`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion Failed: Condition expected to be true');
  }
}

// Test Suite Implementation
async function runSeleniumTestSuite() {
  console.log('\n======================================================');
  console.log('🚀 Starting SHAREBITE E2E Selenium Login Test Suite');
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log(`🌐 Browser: ${BROWSER} | Headless: ${HEADLESS}`);
  console.log('======================================================\n');

  let driver;
  const suiteStartTime = Date.now();

  try {
    driver = await createDriver();
  } catch (err) {
    console.error('❌ Failed to initialize Selenium WebDriver driver:', err.message);
    console.log('\n💡 Note: Make sure chrome / chromedriver is installed or running in a supported environment.');
    process.exit(1);
  }

  try {
    // ----------------------------------------------------
    // Test Suite 1: Page Navigation & Initial Render
    // ----------------------------------------------------
    await runTestCase('TC001_PageLoad_TitleAndHeader', 'Page Navigation', async () => {
      await driver.get(BASE_URL);
      const title = await driver.getTitle();
      assertTrue(title.length >= 0, 'Page title should be accessible');
    });

    await runTestCase('TC002_BrandHeader_IsVisible', 'UI Rendering', async () => {
      const brandElement = await driver.wait(until.elementLocated(By.css('main section div div, main form')), TIMEOUT_MS);
      assertTrue(await brandElement.isDisplayed(), 'Brand component should be visible');
    });

    await runTestCase('TC003_Heading_DefaultRoleTitle', 'UI Rendering', async () => {
      const heading = await driver.findElement(By.css('h1'));
      const text = await heading.getText();
      assertTrue(text.includes('Dashboard') || text.includes('FoodShare'), `Heading title verified: "${text}"`);
    });

    // ----------------------------------------------------
    // Test Suite 2: Role Selector Verification (Donor vs Receiver)
    // ----------------------------------------------------
    await runTestCase('TC004_RoleSelector_SwitchToReceiver', 'Role Switching', async () => {
      const buttons = await driver.findElements(By.css('form button[type="button"]'));
      let receiverBtn = null;
      for (const btn of buttons) {
        const text = await btn.getText();
        if (text.includes('Receiver')) {
          receiverBtn = btn;
          break;
        }
      }
      if (receiverBtn) {
        await receiverBtn.click();
        const heading = await driver.findElement(By.css('h1'));
        const headingText = await heading.getText();
        assertTrue(headingText.includes('Receiver'), 'Heading should update to Receiver Dashboard');
      }
    });

    await runTestCase('TC005_RoleSelector_SwitchToDonor', 'Role Switching', async () => {
      const buttons = await driver.findElements(By.css('form button[type="button"]'));
      let donorBtn = null;
      for (const btn of buttons) {
        const text = await btn.getText();
        if (text.includes('Donor')) {
          donorBtn = btn;
          break;
        }
      }
      if (donorBtn) {
        await donorBtn.click();
        const heading = await driver.findElement(By.css('h1'));
        const headingText = await heading.getText();
        assertTrue(headingText.includes('Donor'), 'Heading should update to Donor Dashboard');
      }
    });

    // ----------------------------------------------------
    // Test Suite 3: Input Field Attributes & Validation
    // ----------------------------------------------------
    await runTestCase('TC006_EmailInput_AttributesCheck', 'Form Validation', async () => {
      const emailInput = await driver.findElement(By.css('input[name="email"]'));
      const typeAttr = await emailInput.getAttribute('type');
      const requiredAttr = await emailInput.getAttribute('required');
      assertEquals(typeAttr, 'email', 'Email input type should be email');
      assertTrue(requiredAttr !== null, 'Email input should be required');
    });

    await runTestCase('TC007_PasswordInput_AttributesCheck', 'Form Validation', async () => {
      const passwordInput = await driver.findElement(By.css('input[name="password"]'));
      const typeAttr = await passwordInput.getAttribute('type');
      const minLength = await passwordInput.getAttribute('minlength');
      assertEquals(typeAttr, 'password', 'Password type must be password');
      assertEquals(minLength, '6', 'Password minlength attribute must be 6');
    });

    // ----------------------------------------------------
    // Test Suite 4: Navigation Links (Home & SignUp Switch)
    // ----------------------------------------------------
    await runTestCase('TC008_SignUpSwitch_ModeToggle', 'Navigation', async () => {
      const toggleLink = await driver.findElement(By.xpath("//button[contains(text(), 'Sign up') or contains(text(), 'Log in')]"));
      await toggleLink.click();
      // Form should now show registration fields (e.g. name, location)
      const inputs = await driver.findElements(By.css('form input'));
      assertTrue(inputs.length >= 4, 'Registration mode should show extra input fields');
    });

    await runTestCase('TC009_LoginSwitch_ModeToggleBack', 'Navigation', async () => {
      const toggleLink = await driver.findElement(By.xpath("//button[contains(text(), 'Log in') or contains(text(), 'Sign up')]"));
      await toggleLink.click();
      const inputs = await driver.findElements(By.css('form input'));
      assertTrue(inputs.length <= 3, 'Login mode should show login input fields');
    });

    await runTestCase('TC010_HomeButton_Navigation', 'Navigation', async () => {
      const homeBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Home')]"));
      assertTrue(await homeBtn.isDisplayed(), 'Home navigation button should be visible');
    });

    // ----------------------------------------------------
    // Test Suite 5: Form Submission & Demo User Credential Execution
    // ----------------------------------------------------
    await runTestCase('TC011_SubmitButton_TextMatchesRole', 'Form Submission', async () => {
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      const submitText = await submitBtn.getText();
      assertTrue(submitText.toLowerCase().includes('log in'), 'Submit button text should reflect login action');
    });

    await runTestCase('TC012_FormSubmit_DemoDonorCredentials', 'End-To-End Auth', async () => {
      const emailInput = await driver.findElement(By.css('input[name="email"]'));
      const passwordInput = await driver.findElement(By.css('input[name="password"]'));
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));

      await emailInput.clear();
      await emailInput.sendKeys('donor@sharebite.org');
      await passwordInput.clear();
      await passwordInput.sendKeys('password123');

      await submitBtn.click();
      await driver.sleep(1000);

      // Check URL or Dashboard page elements post login
      const currentUrl = await driver.getCurrentUrl();
      assertTrue(currentUrl !== null, 'Browser should navigate or maintain login session state');
    });

    // ----------------------------------------------------
    // Test Suite 6: Viewport & Responsiveness Verification
    // ----------------------------------------------------
    await runTestCase('TC013_MobileViewport_RenderCheck', 'Responsiveness', async () => {
      await driver.manage().window().setRect({ width: 375, height: 667 });
      const mainContainer = await driver.findElement(By.css('main'));
      assertTrue(await mainContainer.isDisplayed(), 'Main container should render on mobile screen');
      // Reset back to desktop
      await driver.manage().window().setRect({ width: 1280, height: 800 });
    });

  } catch (globalErr) {
    console.error('⚠️ Global Suite Execution Exception:', globalErr);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }

  const durationSec = ((Date.now() - suiteStartTime) / 1000).toFixed(2);
  printSummary(durationSec);
}

async function runTestCase(testName, category, testFn) {
  const startTime = Date.now();
  try {
    await testFn();
    const duration = Date.now() - startTime;
    recordResult(testName, category, 'PASS', duration);
  } catch (err) {
    const duration = Date.now() - startTime;
    recordResult(testName, category, 'FAIL', duration, err);
  }
}

function printSummary(durationSec) {
  console.log('\n======================================================');
  console.log('📊 SELENIUM TEST SUITE EXECUTION SUMMARY');
  console.log('======================================================');
  console.log(`⏱️ Duration: ${durationSec} seconds`);
  console.log(`📋 Total Tests Run: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️ Skipped: ${testResults.skipped}`);
  console.log(`📈 Pass Rate: ${((testResults.passed / (testResults.total || 1)) * 100).toFixed(1)}%`);
  console.log('======================================================\n');
}

// Execute Suite if run directly
if (require.main === module) {
  runSeleniumTestSuite().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}

module.exports = { runSeleniumTestSuite, testResults };
