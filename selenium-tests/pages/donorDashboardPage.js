const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const logger = require("../utilities/logger");

class DonorDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Header & Navigation Locators
    this.userBadge = By.xpath("//div[contains(text(), 'Donor') or contains(text(), 'Catering')] | //header");
    this.logoutButton = By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]");

    // Donor Sub-nav Tabs
    this.navOverview = By.xpath("//a[contains(@href, '/donor/overview')] | //button[contains(text(), 'Overview')]");
    this.navDonations = By.xpath("//a[contains(@href, '/donor/donations')] | //button[contains(text(), 'Publish Food') or contains(text(), 'Workspace')]");
    this.navRouteAi = By.xpath("//a[contains(@href, '/donor/route-ai')] | //button[contains(text(), 'Route AI')]");
    this.navActivity = By.xpath("//a[contains(@href, '/donor/activity')] | //button[contains(text(), 'Claims')]");
    this.navAnalytics = By.xpath("//a[contains(@href, '/donor/analytics')] | //button[contains(text(), 'Analytics')]");

    // Publish Food Form Locators
    this.titleInput = By.xpath("//input[@name='title']");
    this.categorySelect = By.xpath("//select[@name='category']");
    this.quantityInput = By.xpath("//input[@name='quantity']");
    this.locationInput = By.xpath("//input[@name='location']");
    this.phoneInput = By.xpath("//input[@name='donorPhone']");
    this.pickupWindowInput = By.xpath("//input[@name='pickupWindow']");
    this.hoursInput = By.xpath("//input[@name='hours']");
    this.notesInput = By.xpath("//textarea[@name='notes'] | //input[@name='notes']");
    this.publishSubmitBtn = By.xpath("//form//button[@type='submit' and (contains(text(), 'Publish') or contains(text(), 'Submit'))]");

    // Activity / Claims Locators
    this.approveClaimBtn = By.xpath("//button[contains(text(), 'Approve')]");
    this.rejectClaimBtn = By.xpath("//button[contains(text(), 'Reject')]");
    this.codeInput = By.xpath("//input[@placeholder='6-digit code' or @name='code']");
    this.verifyCodeBtn = By.xpath("//button[contains(text(), 'Verify Code') or contains(text(), 'Verify')]");

    // Notifications / Banners
    this.noticeBanner = By.xpath("//div[contains(@class, 'rounded') and (contains(text(), 'published') or contains(text(), 'Claim') or contains(text(), 'accepted') or contains(text(), 'error'))]");
  }

  async openOverview() {
    await this.open("/donor/overview");
  }

  async openDonationsWorkspace() {
    await this.open("/donor/donations");
  }

  async openActivity() {
    await this.open("/donor/activity");
  }

  async createDonationListing(data) {
    logger.info(`Publishing new food donation listing: "${data.title}"`);
    await this.openDonationsWorkspace();
    if (await this.utils.isElementVisible(this.titleInput)) {
      if (data.title) await this.utils.type(this.titleInput, data.title);
      if (data.category) await this.utils.type(this.categorySelect, data.category);
      if (data.quantity) await this.utils.type(this.quantityInput, String(data.quantity));
      if (data.location) await this.utils.type(this.locationInput, data.location);
      if (data.phone) await this.utils.type(this.phoneInput, data.phone);
      if (data.pickupWindow) await this.utils.type(this.pickupWindowInput, data.pickupWindow);
      if (data.hours) await this.utils.type(this.hoursInput, String(data.hours));
      if (data.notes) await this.utils.type(this.notesInput, data.notes);
      if (await this.utils.isElementVisible(this.publishSubmitBtn)) {
        await this.utils.click(this.publishSubmitBtn);
      }
    }
  }

  async approveFirstClaim() {
    await this.openActivity();
    if (await this.utils.isElementVisible(this.approveClaimBtn)) {
      await this.utils.click(this.approveClaimBtn);
      logger.info("Clicked Approve Claim button.");
    }
  }

  async verifyPickupCode(code) {
    await this.openActivity();
    if (await this.utils.isElementVisible(this.codeInput)) {
      await this.utils.type(this.codeInput, code);
      if (await this.utils.isElementVisible(this.verifyCodeBtn)) {
        await this.utils.click(this.verifyCodeBtn);
      }
      logger.info(`Entered verification pickup code: ${code}`);
    }
  }

  async logout() {
    logger.info("Executing Donor Logout...");
    if (await this.utils.isElementVisible(this.logoutButton)) {
      await this.utils.click(this.logoutButton);
    }
  }
}

module.exports = DonorDashboardPage;
