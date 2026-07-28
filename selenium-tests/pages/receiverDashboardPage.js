const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");
const logger = require("../utilities/logger");

class ReceiverDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Navigation Tabs
    this.navOverview = By.xpath("//a[contains(@href, '/receiver/overview')] | //button[contains(text(), 'Overview')]");
    this.navFeed = By.xpath("//a[contains(@href, '/receiver/feed')] | //button[contains(text(), 'Available Food') or contains(text(), 'Feed')]");
    this.navRouteAi = By.xpath("//a[contains(@href, '/receiver/route-ai')] | //button[contains(text(), 'Route AI')]");
    this.navClaims = By.xpath("//a[contains(@href, '/receiver/claims')] | //button[contains(text(), 'My Claims')]");
    this.navImpact = By.xpath("//a[contains(@href, '/receiver/impact')] | //button[contains(text(), 'Impact')]");

    // Search and Category Filters
    this.searchInput = By.xpath("//input[@placeholder='Search available meals...' or contains(@placeholder, 'Search')]");
    this.filterAllBtn = By.xpath("//button[contains(text(), 'All Foods') or contains(text(), 'All')]");
    this.filterCookedBtn = By.xpath("//button[contains(text(), 'Cooked Meals')]");
    this.filterBakeryBtn = By.xpath("//button[contains(text(), 'Bakery')]");
    this.filterProduceBtn = By.xpath("//button[contains(text(), 'Produce')]");

    // Action Locators
    this.claimFoodBtn = By.xpath("//button[contains(text(), 'Claim Food') or contains(text(), 'Request Pickup') or contains(text(), 'Claim')]");
    this.logoutButton = By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]");
  }

  async openFeed() {
    await this.open("/receiver/feed");
  }

  async openOverview() {
    await this.open("/receiver/overview");
  }

  async searchFood(query) {
    logger.info(`Searching food feed with term: "${query}"`);
    await this.openFeed();
    if (await this.utils.isElementVisible(this.searchInput)) {
      await this.utils.type(this.searchInput, query);
    }
  }

  async applyCategoryFilter(category) {
    logger.info(`Applying feed category filter: ${category}`);
    await this.openFeed();
    if (category.toLowerCase() === "cooked" && await this.utils.isElementVisible(this.filterCookedBtn)) await this.utils.click(this.filterCookedBtn);
    else if (category.toLowerCase() === "bakery" && await this.utils.isElementVisible(this.filterBakeryBtn)) await this.utils.click(this.filterBakeryBtn);
    else if (category.toLowerCase() === "produce" && await this.utils.isElementVisible(this.filterProduceBtn)) await this.utils.click(this.filterProduceBtn);
    else if (await this.utils.isElementVisible(this.filterAllBtn)) await this.utils.click(this.filterAllBtn);
  }

  async claimFirstListing() {
    logger.info("Clicking Claim Food on available listing...");
    await this.openFeed();
    if (await this.utils.isElementVisible(this.claimFoodBtn)) {
      await this.utils.click(this.claimFoodBtn);
    }
  }

  async logout() {
    logger.info("Executing Receiver Logout...");
    if (await this.utils.isElementVisible(this.logoutButton)) {
      await this.utils.click(this.logoutButton);
    }
  }
}

module.exports = ReceiverDashboardPage;
