const { exec } = require("child_process");
const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;

const BACKEND_URL = "http://localhost:5000";
const FRONTEND_URL = "http://localhost:5173";

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkService(url, name) {
  try {
    await axios.get(url);
    console.log(`✅ ${name} is running at ${url}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} is not running at ${url}`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

async function checkBackendFeatures() {
  try {
    console.log("\nTesting Backend Features:");

    // 1. Health Check
    const health = await axios.get(`${BACKEND_URL}/api/health`);
    console.log("✅ Health check endpoint working");

    // 2. Test Authentication Flow
    const testUser = {
      username: `testuser_${Date.now()}`,
      password: "Test@123456",
      shopNames: ["testshop1", "testshop2", "testshop3"],
    };

    // Signup
    const signup = await axios.post(`${BACKEND_URL}/api/auth/signup`, testUser);
    console.log("✅ Signup endpoint working");

    // Signin
    const signin = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      username: testUser.username,
      password: testUser.password,
    });
    const { accessToken } = signin.data;
    console.log("✅ Signin endpoint working");

    // Get Profile
    const profile = await axios.get(`${BACKEND_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("✅ Profile endpoint working");

    return true;
  } catch (error) {
    console.error(
      "Backend test failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

async function checkFrontendFiles() {
  try {
    console.log("\nChecking Frontend Files:");

    const requiredFiles = [
      "client/src/App.jsx",
      "client/src/components/ProtectedRoute.jsx",
      "client/src/context/AuthContext.jsx",
      "client/src/pages/Dashboard.jsx",
      "client/src/pages/ShopDashboard.jsx",
      "client/src/pages/Signin.jsx",
      "client/src/pages/Signup.jsx",
    ];

    for (const file of requiredFiles) {
      const exists = await fs
        .access(path.join(process.cwd(), file))
        .then(() => true)
        .catch(() => false);

      if (exists) {
        console.log(`✅ ${file} exists`);
      } else {
        console.log(`❌ ${file} missing`);
      }
    }

    return true;
  } catch (error) {
    console.error("Frontend check failed:", error);
    return false;
  }
}

async function checkDependencies() {
  try {
    console.log("\nChecking Dependencies:");

    // Check backend dependencies
    const backendPackage = require("../server/package.json");
    console.log("Backend Dependencies:");
    const requiredBackend = [
      "express",
      "mongoose",
      "jsonwebtoken",
      "bcryptjs",
      "cors",
      "dotenv",
    ];

    for (const dep of requiredBackend) {
      if (backendPackage.dependencies[dep]) {
        console.log(`✅ ${dep} installed`);
      } else {
        console.log(`❌ ${dep} missing`);
      }
    }

    // Check frontend dependencies
    const frontendPackage = require("../client/package.json");
    console.log("\nFrontend Dependencies:");
    const requiredFrontend = [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
    ];

    for (const dep of requiredFrontend) {
      if (frontendPackage.dependencies[dep]) {
        console.log(`✅ ${dep} installed`);
      } else {
        console.log(`❌ ${dep} missing`);
      }
    }

    return true;
  } catch (error) {
    console.error("Dependency check failed:", error);
    return false;
  }
}

async function runAllChecks() {
  console.log("Starting system checks...\n");

  // Check if services are running
  const backendRunning = await checkService(BACKEND_URL, "Backend");

  // If backend is running, test its features
  if (backendRunning) {
    await checkBackendFeatures();
  }

  // Check frontend files and dependencies
  await checkFrontendFiles();
  await checkDependencies();
}

// Run all checks
runAllChecks().catch(console.error);
