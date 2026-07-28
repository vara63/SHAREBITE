const { By, until } = require("selenium-webdriver");
const config = require("../config/framework.config");
const SeleniumUtils = require("../utilities/seleniumUtils");
const logger = require("../utilities/logger");

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.utils = new SeleniumUtils(driver);
  }

  async open(pathUrl = "/") {
    const fullUrl = `${config.baseUrl}${pathUrl.startsWith("/") ? "" : "/"}${pathUrl}`;
    logger.info(`Navigating to URL: ${fullUrl}`);
    await this.driver.get(fullUrl);
    await this.waitForPageLoaded();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async waitForPageLoaded(timeout = config.timeouts.pageLoad) {
    await this.driver.wait(async () => {
      const state = await this.driver.executeScript("return document.readyState");
      return state === "complete";
    }, timeout);
  }

  async refresh() {
    logger.info("Refreshing page...");
    await this.driver.navigate().refresh();
    await this.waitForPageLoaded();
  }

  async goBack() {
    logger.info("Navigating browser back...");
    await this.driver.navigate().back();
    await this.waitForPageLoaded();
  }

  async goForward() {
    logger.info("Navigating browser forward...");
    await this.driver.navigate().forward();
    await this.waitForPageLoaded();
  }

  async isElementVisible(locator) {
    return await this.utils.isElementVisible(locator);
  }

  async getText(locator) {
    return await this.utils.getText(locator);
  }
}

module.exports = BasePage;
