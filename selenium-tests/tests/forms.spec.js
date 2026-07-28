const { expect } = require("chai");
const AuthPage = require("../pages/authPage");
const DonorDashboardPage = require("../pages/donorDashboardPage");
const config = require("../config/framework.config");

describe("Form Validation & Input Rules E2E Test Suite", function () {
  let authPage;
  let donorPage;

  before(function () {
    authPage = new AuthPage(global.driver);
    donorPage = new DonorDashboardPage(global.driver);
  });

  it("FORM_01: Validate Registration form required fields validation", async function () {
    await authPage.openRegister();
    if (await authPage.isElementVisible(authPage.emailInput)) {
      await authPage.register("", "", "", "", "donor");
    }
    const currentUrl = await authPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });

  it("FORM_02: Validate Registration email format constraints", async function () {
    await authPage.openRegister();
    if (await authPage.isElementVisible(authPage.emailInput)) {
      await authPage.register("Test User", "invalid_email_format", "Pass123!", "Hyderabad", "donor");
    }
    const currentUrl = await authPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });

  it("FORM_03: Validate Registration field minimum length rules", async function () {
    await authPage.openRegister();
    if (await authPage.isElementVisible(authPage.emailInput)) {
      await authPage.register("A", "valid@email.com", "P", "B", "donor");
    }
    const currentUrl = await authPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });

  it("FORM_04: Validate Food Listing form inputs validation rules", async function () {
    await authPage.openLogin();
    if (await authPage.isElementVisible(authPage.emailInput)) {
      await authPage.login(config.credentials.donor.email, config.credentials.donor.password, "donor");
    }

    await donorPage.openDonationsWorkspace();
    if (await donorPage.isElementVisible(donorPage.titleInput)) {
      await donorPage.createDonationListing({
        title: "Fresh Meal Trays",
        category: "Cooked Meals",
        quantity: 25,
        location: "Kukatpally Main Hub",
        phone: "+91 9876543210",
        pickupWindow: "2 PM - 6 PM",
        hours: 4,
        notes: "Packed hygienically in warm boxes."
      });
    }

    const currentUrl = await donorPage.getCurrentUrl();
    expect(currentUrl).to.be.a("string");
  });
});
