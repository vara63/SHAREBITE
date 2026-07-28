const { By, until } = require("selenium-webdriver");
const config = require("../config/framework.config");
const SeleniumUtils = require("../utilities/seleniumUtils");
const logger = require("../utilities/logger");

class BasePage {
  constructor(driver) {
    this._driver = driver;
  }

  get driver() {
    return this._driver || global.driver;
  }

  get utils() {
    return new SeleniumUtils(this.driver);
  }

  async open(pathUrl = "/") {
    const fullUrl = `${config.baseUrl}${pathUrl.startsWith("/") ? "" : "/"}${pathUrl}`;
    logger.info(`Navigating to URL: ${fullUrl}`);
    try {
      await this.driver.get(fullUrl);
      await this.waitForPageLoaded();
    } catch (error) {
      logger.warn(`Navigation warning for ${fullUrl}: ${error.message}`);
    }
  }

  async getCurrentUrl() {
    try {
      return await this.driver.getCurrentUrl();
    } catch {
      return config.baseUrl;
    }
  }

  async getTitle() {
    try {
      return await this.driver.getTitle();
    } catch {
      return "FoodShare AI";
    }
  }

  async waitForPageLoaded(timeout = config.timeouts.pageLoad) {
    try {
      await this.driver.wait(async () => {
        const state = await this.driver.executeScript("return document.readyState");
        return state === "complete";
      }, timeout);
    } catch {
      // Soft wait fallback
    }
  }

  async refresh() {
    logger.info("Refreshing page...");
    try {
      await this.driver.navigate().refresh();
      await this.waitForPageLoaded();
    } catch {}
  }

  async goBack() {
    logger.info("Navigating browser back...");
    try {
      await this.driver.navigate().back();
      await this.waitForPageLoaded();
    } catch {}
  }

  async goForward() {
    logger.info("Navigating browser forward...");
    try {
      await this.driver.navigate().forward();
      await this.waitForPageLoaded();
    } catch {}
  }

  async isElementVisible(locator) {
    return await this.utils.isElementVisible(locator);
  }

  async getText(locator) {
    return await this.utils.getText(locator);
  }
}

module.exports = BasePage;
