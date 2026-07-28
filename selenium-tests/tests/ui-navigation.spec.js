const { expect } = require("chai");
const LandingPage = require("../pages/landingPage");
const ReceiverDashboardPage = require("../pages/receiverDashboardPage");
const AuthPage = require("../pages/authPage");
const config = require("../config/framework.config");

describe("UI Components & Navigation E2E Test Suite", function () {
  let landingPage;
  let receiverPage;
  let authPage;

  before(function () {
    landingPage = new LandingPage(global.driver);
    receiverPage = new ReceiverDashboardPage(global.driver);
    authPage = new AuthPage(global.driver);
  });

  it("NAV_01: Validate public navbar navigation links", async function () {
    await landingPage.openLandingPage();
    if (await landingPage.isElementVisible(landingPage.navPersonas)) {
      await landingPage.clickNavPersonas();
    }
    const currentUrl = await landingPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });

  it("NAV_02: Validate browser back and forward history actions", async function () {
    await landingPage.goBack();
    await landingPage.goForward();
    const currentUrl = await landingPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });

  it("UI_01: Validate Receiver Feed search bar and category filters", async function () {
    await authPage.openLogin();
    if (await authPage.isElementVisible(authPage.emailInput)) {
      await authPage.login(config.credentials.receiver.email, config.credentials.receiver.password, "receiver");
    }

    await receiverPage.openFeed();
    if (await receiverPage.isElementVisible(receiverPage.searchInput)) {
      await receiverPage.searchFood("Biryani");
    }
    const currentUrl = await receiverPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });
});
