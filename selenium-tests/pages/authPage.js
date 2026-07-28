const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const logger = require("../utilities/logger");

class AuthPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.loginTab = By.xpath("//button[contains(text(), 'Sign In') or contains(text(), 'Login')]");
    this.registerTab = By.xpath("//button[contains(text(), 'Create Account') or contains(text(), 'Register')]");

    this.roleDonorBtn = By.xpath("//button[contains(text(), 'Food Donor') or contains(text(), 'Donor')]");
    this.roleReceiverBtn = By.xpath("//button[contains(text(), 'Food Receiver') or contains(text(), 'Receiver')]");

    this.emailInput = By.xpath("//input[@name='email' or @type='email']");
    this.passwordInput = By.xpath("//input[@name='password' or @type='password']");
    this.nameInput = By.xpath("//input[@name='name']");
    this.locationInput = By.xpath("//input[@name='location']");

    this.submitButton = By.xpath("//button[@type='submit']");
    this.demoCredentialBtn = By.xpath("//button[contains(text(), 'Fill Demo') or contains(text(), 'Demo Credential') or contains(text(), 'Fill')]");
    this.errorMessageBanner = By.xpath("//div[contains(@class, 'bg-rose') or contains(@class, 'border-rose') or contains(@class, 'text-rose') or contains(text(), 'Could not sign in') or contains(text(), 'Fill every field')]");
  }

  async openLogin() {
    await this.open("/login");
  }

  async openRegister() {
    await this.open("/register");
  }

  async selectRole(role = "donor") {
    if (role.toLowerCase() === "donor") {
      await this.utils.click(this.roleDonorBtn);
    } else {
      await this.utils.click(this.roleReceiverBtn);
    }
  }

  async login(email, password, role = "donor") {
    logger.info(`Performing login for ${email} with role ${role}`);
    await this.selectRole(role);
    if (email !== undefined) await this.utils.type(this.emailInput, email);
    if (password !== undefined) await this.utils.type(this.passwordInput, password);
    await this.utils.click(this.submitButton);
  }

  async register(name, email, password, location, role = "donor") {
    logger.info(`Performing registration for ${email} as ${role}`);
    await this.selectRole(role);
    if (name !== undefined) await this.utils.type(this.nameInput, name);
    if (email !== undefined) await this.utils.type(this.emailInput, email);
    if (password !== undefined) await this.utils.type(this.passwordInput, password);
    if (location !== undefined) await this.utils.type(this.locationInput, location);
    await this.utils.click(this.submitButton);
  }

  async fillDemoCredentials() {
    if (await this.utils.isElementPresent(this.demoCredentialBtn)) {
      await this.utils.click(this.demoCredentialBtn);
    }
  }

  async getErrorMessage() {
    if (await this.utils.isElementPresent(this.errorMessageBanner)) {
      return await this.utils.getText(this.errorMessageBanner);
    }
    return "";
  }
}

module.exports = AuthPage;
