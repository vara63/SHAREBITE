const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const logger = require("../utilities/logger");

class LandingPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators
    this.brandLogo = By.xpath("//a[contains(@href, '/')]//span[contains(text(), 'SHAREBITE')] | //span[contains(text(), 'FoodShare AI')] | //h1[contains(text(), 'FoodShare')]");
    this.loginNavButton = By.xpath("//a[contains(@href, '/login')] | //button[contains(text(), 'Sign In')] | //button[contains(text(), 'Login')]");
    this.registerNavButton = By.xpath("//a[contains(@href, '/register')] | //button[contains(text(), 'Create Account')] | //button[contains(text(), 'Register')]");
    this.donorDemoBtn = By.xpath("//button[contains(text(), 'Explore as Donor')] | //button[contains(text(), 'Donor Workspace')]");
    this.receiverDemoBtn = By.xpath("//button[contains(text(), 'Explore as Receiver')] | //button[contains(text(), 'Receiver Feed')]");

    // Public Section Navbar Links
    this.navPersonas = By.xpath("//a[contains(@href, '/personas')]");
    this.navAiStack = By.xpath("//a[contains(@href, '/ai-stack')]");
    this.navPlatform = By.xpath("//a[contains(@href, '/platform')]");
    this.navProof = By.xpath("//a[contains(@href, '/proof')]");
  }

  async openLandingPage() {
    await this.open("/");
  }

  async navigateToLogin() {
    logger.info("Clicking Login / Sign In from Landing Page...");
    await this.utils.click(this.loginNavButton);
  }

  async navigateToRegister() {
    logger.info("Clicking Register / Create Account from Landing Page...");
    await this.utils.click(this.registerNavButton);
  }

  async clickNavPersonas() {
    await this.utils.click(this.navPersonas);
  }

  async clickNavAiStack() {
    await this.utils.click(this.navAiStack);
  }

  async clickNavPlatform() {
    await this.utils.click(this.navPlatform);
  }

  async clickNavProof() {
    await this.utils.click(this.navProof);
  }
}

module.exports = LandingPage;
