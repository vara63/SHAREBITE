const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");
try { require("chromedriver"); } catch {}
const config = require("../config/framework.config");
const logger = require("./logger");

class DriverFactory {
  static async createDriver(browserName = config.browser, isHeadless = config.headless) {
    const targetBrowser = browserName.toLowerCase();
    logger.info(`Initializing ${targetBrowser.toUpperCase()} WebDriver (Headless: ${isHeadless})...`);

    let builder = new Builder();

    switch (targetBrowser) {
      case "chrome": {
        const chromeOptions = new chrome.Options();
        if (isHeadless) {
          chromeOptions.addArguments("--headless=new");
        }
        chromeOptions.addArguments(
          `--window-size=${config.windowSize.width},${config.windowSize.height}`,
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-popup-blocking",
          "--ignore-certificate-errors",
          "--remote-allow-origins=*"
        );

        builder = builder.forBrowser("chrome").setChromeOptions(chromeOptions);
        break;
      }

      case "firefox": {
        const firefoxOptions = new firefox.Options();
        if (isHeadless) {
          firefoxOptions.addArguments("-headless");
        }
        firefoxOptions.addArguments(`--width=${config.windowSize.width}`, `--height=${config.windowSize.height}`);

        builder = builder.forBrowser("firefox").setFirefoxOptions(firefoxOptions);
        break;
      }

      case "edge": {
        const edgeOptions = new edge.Options();
        if (isHeadless) {
          edgeOptions.addArguments("--headless=new");
        }
        edgeOptions.addArguments(
          `--window-size=${config.windowSize.width},${config.windowSize.height}`,
          "--no-sandbox",
          "--disable-dev-shm-usage"
        );

        builder = builder.forBrowser("MicrosoftEdge").setEdgeOptions(edgeOptions);
        break;
      }

      default:
        throw new Error(`Unsupported browser: ${targetBrowser}. Allowed: chrome, firefox, edge.`);
    }

    const driver = await builder.build();

    // Set implicit timeout
    await driver.manage().setTimeouts({
      implicit: config.timeouts.implicit,
      pageLoad: config.timeouts.pageLoad,
      script: config.timeouts.script
    });

    if (!isHeadless) {
      await driver.manage().window().maximize();
    }

    logger.info(`Successfully created ${targetBrowser.toUpperCase()} driver instance.`);
    return driver;
  }
}

module.exports = DriverFactory;
