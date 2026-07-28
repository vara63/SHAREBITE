const { expect } = require("chai");
const AuthPage = require("../pages/authPage");
const DonorDashboardPage = require("../pages/donorDashboardPage");
const ReceiverDashboardPage = require("../pages/receiverDashboardPage");
const config = require("../config/framework.config");
const logger = require("../utilities/logger");

describe("Complete End-to-End Business Workflow Test Suite", function () {
  let authPage;
  let donorPage;
  let receiverPage;

  before(function () {
    authPage = new AuthPage(global.driver);
    donorPage = new DonorDashboardPage(global.driver);
    receiverPage = new ReceiverDashboardPage(global.driver);
  });

  it("E2E_01: Complete Donor Publishing to Receiver Claiming & Verification Workflow", async function () {
    // Step 1: Donor Login & Listing Creation
    logger.info("E2E Workflow Step 1: Donor Login & Listing Creation");
    await authPage.openLogin();
    await authPage.login(config.credentials.donor.email, config.credentials.donor.password, "donor");

    const listingTitle = `Fresh Meals Batch ${Date.now()}`;
    await donorPage.createDonationListing({
      title: listingTitle,
      category: "Cooked Meals",
      quantity: 50,
      location: "Kukatpally, Hyderabad",
      phone: "+91 9876543210",
      pickupWindow: "5 PM - 8 PM",
      hours: 6,
      notes: "Freshly prepared vegetable meals ready for immediate dispatch."
    });

    await donorPage.logout();

    // Step 2: Receiver Login & Food Claiming
    logger.info("E2E Workflow Step 2: Receiver Login & Claim Request");
    await authPage.openLogin();
    await authPage.login(config.credentials.receiver.email, config.credentials.receiver.password, "receiver");

    await receiverPage.openFeed();
    await receiverPage.claimFirstListing();

    await receiverPage.logout();

    // Step 3: Donor Approval of Claim Request
    logger.info("E2E Workflow Step 3: Donor Approval");
    await authPage.openLogin();
    await authPage.login(config.credentials.donor.email, config.credentials.donor.password, "donor");

    await donorPage.approveFirstClaim();

    const finalUrl = await donorPage.getCurrentUrl();
    expect(finalUrl).to.include("/donor");
  });
});
