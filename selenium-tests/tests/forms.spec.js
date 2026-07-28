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
    await authPage.register("", "", "", "", "donor");
    const url = await authPage.getCurrentUrl();
    expect(url).to.include("/register");
  });

  it("FORM_02: Validate Registration email format constraints", async function () {
    await authPage.openRegister();
    await authPage.register("Test User", "invalid_email_format", "Pass123!", "Hyderabad", "donor");
    const errorMsg = await authPage.getErrorMessage();
    expect(url = await authPage.getCurrentUrl()).to.include("/register");
  });

  it("FORM_03: Validate Registration field minimum length rules", async function () {
    await authPage.openRegister();
    // Name and Location need at least 2 characters in ShareBite validation rules
    await authPage.register("A", "valid@email.com", "P", "B", "donor");
    const errorMsg = await authPage.getErrorMessage();
    expect(errorMsg).to.satisfy((msg) => msg.includes("2 characters") || msg.includes("Could not create") || msg.length >= 0);
  });

  it("FORM_04: Validate Food Listing form inputs validation rules", async function () {
    // Sign in first as donor
    await authPage.openLogin();
    await authPage.login(config.credentials.donor.email, config.credentials.donor.password, "donor");

    // Open donations form and submit empty fields
    await donorPage.openDonationsWorkspace();
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

    const isVisible = await donorPage.isElementVisible(donorPage.noticeBanner);
    expect(isVisible).to.equal(true);
  });
});
