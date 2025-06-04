const axios = require("axios");
const assert = require("assert");
const chalk = require("chalk");
const fs = require("fs").promises;
const path = require("path");

const API_URL = "http://localhost:5000/api";
let authToken = "";
let refreshToken = "";

// Test status tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

// Test user data
const testUser = {
  username: "testuser" + Date.now(),
  password: "Test@123456",
  shopNames: ["testshop1", "testshop2", "testshop3"],
};

async function runTest(name, testFn) {
  const startTime = Date.now();
  testResults.total++;

  try {
    await testFn();
    const duration = Date.now() - startTime;
    testResults.passed++;
    testResults.details.push({ name, status: "passed", duration });
    console.log(chalk.green(`✓ ${name} passed (${duration}ms)\n`));
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    testResults.failed++;
    testResults.details.push({
      name,
      status: "failed",
      duration,
      error: error.message,
    });
    console.log(chalk.red(`✗ ${name} failed: ${error.message}\n`));
    return false;
  }
}

async function generateTestReport() {
  const template = await fs.readFile(
    path.join(__dirname, "test-results-template.md"),
    "utf8"
  );

  const report = template
    .replace("{{timestamp}}", new Date().toISOString())
    .replace("{{totalTests}}", testResults.total)
    .replace("{{passedTests}}", testResults.passed)
    .replace("{{failedTests}}", testResults.failed)
    .replace("{{nodeVersion}}", process.version)
    .replace(
      "{{testDetails}}",
      testResults.details
        .map(
          (test) =>
            `### ${test.name}\n- Status: ${test.status}\n- Duration: ${
              test.duration
            }ms${test.error ? `\n- Error: ${test.error}` : ""}`
        )
        .join("\n\n")
    );

  await fs.writeFile(path.join(__dirname, "test-results.md"), report);
}

async function runTests() {
  console.log(chalk.blue.bold("Starting API Tests...\n"));

  await runTest("Health Check", async () => {
    const health = await axios.get(`${API_URL}/health`);
    assert(health.data.success === true, "Health check failed");
  });

  await runTest("User Signup", async () => {
    const signup = await axios.post(`${API_URL}/auth/signup`, testUser);
    assert(signup.data.success === true, "Signup failed");
    assert(
      signup.data.user.username === testUser.username,
      "Username mismatch"
    );
  });

  await runTest("User Signin", async () => {
    const signin = await axios.post(`${API_URL}/auth/signin`, {
      username: testUser.username,
      password: testUser.password,
    });
    assert(signin.data.success === true, "Signin failed");
    assert(signin.data.accessToken, "No access token provided");
    assert(signin.data.refreshToken, "No refresh token provided");
    authToken = signin.data.accessToken;
    refreshToken = signin.data.refreshToken;
  });

  await runTest("Get User Profile", async () => {
    const profile = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(profile.data.success === true, "Get profile failed");
    assert(
      profile.data.user.username === testUser.username,
      "Username mismatch"
    );
  });

  await runTest("Token Refresh", async () => {
    const refresh = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );
    assert(refresh.data.success === true, "Token refresh failed");
    assert(refresh.data.accessToken, "No new access token provided");
  });

  await runTest("Verify Shops Created", async () => {
    const profile = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(
      profile.data.user.shops.length === testUser.shopNames.length,
      "Incorrect number of shops created"
    );

    testUser.shopNames.forEach((shopName) => {
      const shop = profile.data.user.shops.find((s) => s.name === shopName);
      assert(shop, `Shop ${shopName} not found`);
    });
  });

  await runTest("Invalid Token Test", async () => {
    try {
      await axios.get(`${API_URL}/user/profile`, {
        headers: { Authorization: "Bearer invalid_token" },
      });
      throw new Error("Should have rejected invalid token");
    } catch (error) {
      if (!error.response || error.response.status !== 401) {
        throw new Error("Did not properly handle invalid token");
      }
    }
  });

  // Generate test report
  await generateTestReport();

  // Print summary
  console.log(chalk.blue.bold("\nTest Summary:"));
  console.log(chalk.white(`Total Tests: ${testResults.total}`));
  console.log(chalk.green(`Passed: ${testResults.passed}`));
  console.log(chalk.red(`Failed: ${testResults.failed}`));
  console.log(chalk.blue("\nDetailed results saved to test-results.md"));

  // Exit with appropriate code
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run the tests
runTests().catch((error) => {
  console.error(chalk.red("\nTest suite failed to run:"), error);
  process.exit(1);
});
