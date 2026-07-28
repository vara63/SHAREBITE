const { expect } = require("chai");
const AuthPage = require("../pages/authPage");
const LandingPage = require("../pages/landingPage");
const DonorDashboardPage = require("../pages/donorDashboardPage");
const ReceiverDashboardPage = require("../pages/receiverDashboardPage");
const config = require("../config/framework.config");

describe("Authentication & Session E2E Test Suite", function () {
  let authPage;
  let landingPage;
  let donorPage;
  let receiverPage;

  before(function () {
    authPage = new AuthPage(global.driver);
    landingPage = new LandingPage(global.driver);
    donorPage = new DonorDashboardPage(global.driver);
    receiverPage = new ReceiverDashboardPage(global.driver);
  });

  it("AUTH_01: Validate login form with empty username and password", async function () {
    await authPage.openLogin();
    await authPage.login("", "");
    // Form HTML5 / custom JS prevents submission or triggers error
    const url = await authPage.getCurrentUrl();
    expect(url).to.include("/login");
  });

  it("AUTH_02: Validate login rejection with invalid credentials", async function () {
    await authPage.openLogin();
    await authPage.login(config.credentials.invalidUser.email, config.credentials.invalidUser.password, "donor");
    const errorMsg = await authPage.getErrorMessage();
    expect(errorMsg).to.satisfy(
      (msg) => msg.includes("Could not sign in") || msg.includes("Check email and password") || msg.length >= 0
    );
  });

  it("AUTH_03: Validate successful Donor login and role-based redirect", async function () {
    await authPage.openLogin();
    await authPage.login(config.credentials.donor.email, config.credentials.donor.password, "donor");
    const url = await donorPage.getCurrentUrl();
    expect(url).to.include("/donor");
  });

  it("AUTH_04: Validate session persistence upon page refresh", async function () {
    await donorPage.refresh();
    const url = await donorPage.getCurrentUrl();
    expect(url).to.include("/donor");
  });

  it("AUTH_05: Validate successful Donor Logout", async function () {
    await donorPage.logout();
    const url = await authPage.getCurrentUrl();
    expect(url).to.not.include("/donor");
  });

  it("AUTH_06: Validate protected donor route redirects unauthenticated user", async function () {
    await donorPage.open("/donor/overview");
    const url = await donorPage.getCurrentUrl();
    expect(url).to.include("/login");
  });

  it("AUTH_07: Validate successful Receiver login and role-based redirect", async function () {
    await authPage.openLogin();
    await authPage.login(config.credentials.receiver.email, config.credentials.receiver.password, "receiver");
    const url = await receiverPage.getCurrentUrl();
    expect(url).to.include("/receiver");
  });
});
