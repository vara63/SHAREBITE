const fs = require("fs");
const path = require("path");
const logger = require("./logger");

class RouteFormDiscoverer {
  constructor(appTsxPath, pagesDir) {
    this.appTsxPath =
      appTsxPath || path.resolve(__dirname, "../../frontend/src/App.tsx");
    this.pagesDir =
      pagesDir || path.resolve(__dirname, "../../frontend/src/pages");
  }

  discoverRoutesAndForms() {
    logger.info("Scanning React codebase for routes, components, and forms...");

    const routes = [];
    const discoveredForms = [];

    // Check if App.tsx exists
    if (!fs.existsSync(this.appTsxPath)) {
      logger.warn(`App.tsx not found at ${this.appTsxPath}. Using fallback route registry.`);
      return this.getFallbackDiscovery();
    }

    const appTsxContent = fs.readFileSync(this.appTsxPath, "utf-8");

    // Extract Routes using RegEx matching
    const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
    let match;
    while ((match = routeRegex.exec(appTsxContent)) !== null) {
      const routePath = match[1];
      if (routePath !== "*") {
        routes.push({
          path: routePath,
          isProtected: routePath.startsWith("/donor") || routePath.startsWith("/receiver"),
          requiredRole: routePath.startsWith("/donor") ? "donor" : routePath.startsWith("/receiver") ? "receiver" : "public"
        });
      }
    }

    // Discover Forms in AuthPage and DashboardPage
    if (fs.existsSync(this.pagesDir)) {
      const pageFiles = fs.readdirSync(this.pagesDir);
      pageFiles.forEach((file) => {
        const filePath = path.join(this.pagesDir, file);
        if (fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath, "utf-8");

          if (content.includes("onSubmit") || content.includes("<form")) {
            discoveredForms.push({
              sourceFile: file,
              hasEmailField: content.includes('name="email"') || content.includes('type="email"'),
              hasPasswordField: content.includes('name="password"') || content.includes('type="password"'),
              hasLocationField: content.includes('name="location"'),
              hasPhoneField: content.includes('name="donorPhone"') || content.includes('phone'),
              hasCategoryDropdown: content.includes('name="category"') || content.includes('select'),
              hasQuantityInput: content.includes('name="quantity"'),
              hasHoursInput: content.includes('name="hours"')
            });
          }
        }
      });
    }

    logger.info(`Discovered ${routes.length} React routes and ${discoveredForms.length} interactive form modules.`);

    // Auto-generate Test Cases from Rules
    const generatedTestCases = this.generateTestCases(routes, discoveredForms);

    return {
      routes,
      discoveredForms,
      generatedTestCases
    };
  }

  generateTestCases(routes, discoveredForms) {
    const testCases = [];

    // 1. Dynamic Public Route Navigation Tests
    routes
      .filter((r) => !r.isProtected)
      .forEach((r, idx) => {
        testCases.push({
          id: `DYN_NAV_${idx + 1}`,
          module: "Dynamic Route Discovery",
          scenarioName: `Validate navigation to public route "${r.path}"`,
          type: "navigation",
          targetUrl: r.path,
          expectedProtected: false
        });
      });

    // 2. Dynamic Protected Route Redirect Tests
    routes
      .filter((r) => r.isProtected)
      .forEach((r, idx) => {
        testCases.push({
          id: `DYN_PROT_${idx + 1}`,
          module: "Dynamic Route Discovery",
          scenarioName: `Verify unauthorized access to protected route "${r.path}" redirects to login`,
          type: "protected_access",
          targetUrl: r.path,
          expectedProtected: true
        });
      });

    // 3. Dynamic Form Field Validation Test Matrix
    discoveredForms.forEach((form, idx) => {
      testCases.push({
        id: `DYN_FORM_${idx + 1}_EMPTY`,
        module: `Dynamic Form Discovery (${form.sourceFile})`,
        scenarioName: `Submit form with empty required fields in ${form.sourceFile}`,
        type: "form_validation",
        formSource: form.sourceFile,
        payload: {}
      });

      if (form.hasEmailField) {
        testCases.push({
          id: `DYN_FORM_${idx + 1}_EMAIL`,
          module: `Dynamic Form Discovery (${form.sourceFile})`,
          scenarioName: `Validate invalid email format rejection in ${form.sourceFile}`,
          type: "email_validation",
          formSource: form.sourceFile,
          invalidEmail: "user_without_at_domain.com"
        });
      }
    });

    return testCases;
  }

  getFallbackDiscovery() {
    const routes = [
      { path: "/", isProtected: false, requiredRole: "public" },
      { path: "/login", isProtected: false, requiredRole: "public" },
      { path: "/register", isProtected: false, requiredRole: "public" },
      { path: "/donor/overview", isProtected: true, requiredRole: "donor" },
      { path: "/donor/donations", isProtected: true, requiredRole: "donor" },
      { path: "/receiver/overview", isProtected: true, requiredRole: "receiver" },
      { path: "/receiver/feed", isProtected: true, requiredRole: "receiver" }
    ];

    const discoveredForms = [
      { sourceFile: "AuthPage.tsx", hasEmailField: true, hasPasswordField: true, hasLocationField: true },
      { sourceFile: "DashboardPage.tsx", hasEmailField: false, hasQuantityInput: true, hasCategoryDropdown: true }
    ];

    return {
      routes,
      discoveredForms,
      generatedTestCases: this.generateTestCases(routes, discoveredForms)
    };
  }
}

const discovererInstance = new RouteFormDiscoverer();

if (require.main === module) {
  const result = discovererInstance.discoverRoutesAndForms();
  console.log("Discovered Routes:", result.routes.length);
  console.log("Discovered Forms:", result.discoveredForms.length);
  console.log("Generated Test Cases:", result.generatedTestCases.length);
}

module.exports = discovererInstance;

