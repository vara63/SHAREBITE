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

    await landingPage.clickNavPersonas();
    expect(await landingPage.getCurrentUrl()).to.include("/personas");

    await landingPage.clickNavAiStack();
    expect(await landingPage.getCurrentUrl()).to.include("/ai-stack");

    await landingPage.clickNavPlatform();
    expect(await landingPage.getCurrentUrl()).to.include("/platform");

    await landingPage.clickNavProof();
    expect(await landingPage.getCurrentUrl()).to.include("/proof");
  });

  it("NAV_02: Validate browser back and forward history actions", async function () {
    await landingPage.goBack();
    expect(await landingPage.getCurrentUrl()).to.include("/platform");

    await landingPage.goForward();
    expect(await landingPage.getCurrentUrl()).to.include("/proof");
  });

  it("UI_01: Validate Receiver Feed search bar and category filters", async function () {
    await authPage.openLogin();
    await authPage.login(config.credentials.receiver.email, config.credentials.receiver.password, "receiver");

    await receiverPage.openFeed();

    // Test Search input
    await receiverPage.searchFood("Biryani");
    const currentUrl = await receiverPage.getCurrentUrl();
    expect(currentUrl).to.include("/receiver/feed");

    // Test Category filter buttons
    await receiverPage.applyCategoryFilter("cooked");
    await receiverPage.applyCategoryFilter("bakery");
    await receiverPage.applyCategoryFilter("all");
  });
});
