const { By, until, logging } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");
const config = require("../config/framework.config");
const logger = require("./logger");

class SeleniumUtils {
  constructor(driver) {
    this.driver = driver;
  }

  // Explicit Wait for Element Located & Visible
  async waitForElementVisible(locator, timeout = config.timeouts.explicit) {
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      await this.driver.wait(until.elementIsVisible(element), timeout);
      return element;
    } catch (error) {
      logger.error(`Element not visible: ${locator.toString()} within ${timeout}ms. Error: ${error.message}`);
      throw error;
    }
  }

  // Explicit Wait for Element Clickable
  async waitForElementClickable(locator, timeout = config.timeouts.explicit) {
    try {
      const element = await this.waitForElementVisible(locator, timeout);
      await this.driver.wait(until.elementIsEnabled(element), timeout);
      return element;
    } catch (error) {
      logger.error(`Element not clickable: ${locator.toString()} within ${timeout}ms. Error: ${error.message}`);
      throw error;
    }
  }

  // Safe Click with auto wait
  async click(locator, timeout = config.timeouts.explicit) {
    const element = await this.waitForElementClickable(locator, timeout);
    await this.scrollToElement(element);
    await element.click();
    logger.info(`Clicked element: ${locator.toString()}`);
  }

  // Safe SendKeys / Type with clear
  async type(locator, text, timeout = config.timeouts.explicit) {
    const element = await this.waitForElementVisible(locator, timeout);
    await element.clear();
    await element.sendKeys(text);
    logger.info(`Typed "${text}" into element: ${locator.toString()}`);
  }

  // Get Text from Element
  async getText(locator, timeout = config.timeouts.explicit) {
    const element = await this.waitForElementVisible(locator, timeout);
    const text = await element.getText();
    return text.trim();
  }

  // Get Value Attribute from Input
  async getValue(locator, timeout = config.timeouts.explicit) {
    const element = await this.waitForElementVisible(locator, timeout);
    return await element.getAttribute("value");
  }

  // Element Presence Check
  async isElementPresent(locator) {
    try {
      const elements = await this.driver.findElements(locator);
      return elements.length > 0;
    } catch {
      return false;
    }
  }

  // Element Visibility Check
  async isElementVisible(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  // JavaScript Execution
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  // Scroll to Element using JS
  async scrollToElement(element) {
    await this.driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
    await this.driver.sleep(200);
  }

  // Scroll to Bottom of Page
  async scrollToBottom() {
    await this.driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
  }

  // Scroll to Top of Page
  async scrollToTop() {
    await this.driver.executeScript("window.scrollTo(0, 0);");
  }

  // Window Handling - Switch by Index
  async switchToWindow(index) {
    const handles = await this.driver.getAllWindowHandles();
    if (handles[index]) {
      await this.driver.switchTo().window(handles[index]);
      logger.info(`Switched to window handle index ${index}`);
    } else {
      throw new Error(`Window index ${index} out of bounds (${handles.length} total handles)`);
    }
  }

  // Alert Handling - Accept
  async acceptAlert() {
    try {
      await this.driver.wait(until.alertIsPresent(), config.timeouts.explicit);
      const alert = await this.driver.switchTo().alert();
      const text = await alert.getText();
      await alert.accept();
      logger.info(`Accepted alert with text: "${text}"`);
      return text;
    } catch (error) {
      logger.warn(`No alert present to accept: ${error.message}`);
      return null;
    }
  }

  // Alert Handling - Dismiss
  async dismissAlert() {
    try {
      await this.driver.wait(until.alertIsPresent(), config.timeouts.explicit);
      const alert = await this.driver.switchTo().alert();
      const text = await alert.getText();
      await alert.dismiss();
      logger.info(`Dismissed alert with text: "${text}"`);
      return text;
    } catch (error) {
      logger.warn(`No alert present to dismiss: ${error.message}`);
      return null;
    }
  }

  // Screenshot Capture
  async takeScreenshot(fileNamePrefix = "screenshot") {
    try {
      const screenshotsDir = config.paths.screenshotsDir;
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${fileNamePrefix}_${timestamp}.png`;
      const filePath = path.join(screenshotsDir, filename);

      const screenshotData = await this.driver.takeScreenshot();
      fs.writeFileSync(filePath, screenshotData, "base64");
      logger.info(`Screenshot saved to: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Failed to capture screenshot: ${error.message}`);
      return null;
    }
  }

  // Failure Screenshot & Details Collector
  async captureFailureDetails(testName) {
    const safeName = testName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const failuresDir = config.paths.failuresDir;
    if (!fs.existsSync(failuresDir)) {
      fs.mkdirSync(failuresDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotPath = path.join(failuresDir, `FAIL_${safeName}_${timestamp}.png`);

    try {
      const image = await this.driver.takeScreenshot();
      fs.writeFileSync(screenshotPath, image, "base64");
    } catch (err) {
      logger.error(`Could not save failure screenshot: ${err.message}`);
    }

    let currentUrl = "Unknown";
    try {
      currentUrl = await this.driver.getCurrentUrl();
    } catch {}

    const consoleLogs = await this.getBrowserConsoleLogs();

    return {
      testName,
      screenshotPath,
      currentUrl,
      consoleLogs
    };
  }

  // Browser Console Logs Extractor
  async getBrowserConsoleLogs() {
    try {
      const logs = await this.driver.manage().logs().get(logging.Type.BROWSER);
      return logs.map((log) => `[${log.level.name}] ${log.message}`).join("\n");
    } catch {
      return "Console logs unavailable for this driver.";
    }
  }

  // Operation Retry Mechanism
  async retryOperation(operationFn, maxRetries = 3, delayMs = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operationFn();
      } catch (error) {
        lastError = error;
        logger.warn(`Operation attempt ${attempt}/${maxRetries} failed: ${error.message}. Retrying in ${delayMs}ms...`);
        await this.driver.sleep(delayMs);
      }
    }
    throw lastError;
  }
}

module.exports = SeleniumUtils;
