const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");
const execAsync = promisify(exec);

const BACKEND_URL = "http://localhost:5000";
const FRONTEND_URL = "http://localhost:5174";

async function checkServerStatus() {
  console.log("\n🔍 Checking Server Status:");

  try {
    const health = await axios.get(`${BACKEND_URL}/api/health`);
    console.log("✅ Backend server is running");
    console.log(`   Database: ${health.data.database}`);
    console.log(`   Environment: ${health.data.environment}`);
    console.log(`   Uptime: ${Math.floor(health.data.uptime / 60)} minutes`);
  } catch (error) {
    console.log("❌ Backend server is not responding");
    throw new Error("Backend server check failed");
  }
}

async function testAuthFlow() {
  console.log("\n🔍 Testing Authentication Flow:");

  const testUser = {
    username: `test_${Date.now()}`,
    password: "Test@123456",
    shopNames: ["testshop1", "testshop2", "testshop3"],
  };

  try {
    // Test signup
    const signup = await axios.post(`${BACKEND_URL}/api/auth/signup`, testUser);
    console.log("✅ Signup endpoint working");

    // Test signin
    const signin = await axios.post(`${BACKEND_URL}/api/auth/signin`, {
      username: testUser.username,
      password: testUser.password,
    });
    console.log("✅ Signin endpoint working");

    // Test profile with auth
    const profile = await axios.get(`${BACKEND_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${signin.data.accessToken}` },
    });
    console.log("✅ Protected profile endpoint working");
    console.log(
      "✅ User shops created successfully:",
      profile.data.user.shops.length
    );

    return true;
  } catch (error) {
    console.log(
      "❌ Authentication flow failed:",
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function checkFrontendBuild() {
  console.log("\n🔍 Testing Frontend Build:");

  try {
    const result = await execAsync("cd client && npm run build");
    console.log("✅ Frontend builds successfully");
    return true;
  } catch (error) {
    console.log("❌ Frontend build failed:", error.message);
    return false;
  }
}

async function checkRequiredFiles() {
  console.log("\n🔍 Checking Required Files:");

  const requiredFiles = [
    "client/src/App.jsx",
    "client/src/context/AuthContext.jsx",
    "server/config/db.js",
    "server/middleware/auth.js",
    "server/routes/auth.js",
    "server/routes/user.js",
    "server/.env",
    "client/.env",
  ];

  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(process.cwd(), file));
      console.log(`✅ ${file} exists`);
    } catch {
      console.log(`❌ ${file} missing`);
    }
  }
}

async function checkEnvironmentVariables() {
  console.log("\n🔍 Checking Environment Variables:");

  const requiredEnvVars = {
    server: ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"],
    client: ["VITE_API_URL"],
  };

  // Check server env
  try {
    const serverEnv = await fs.readFile(
      path.join(process.cwd(), "server/.env"),
      "utf8"
    );
    for (const env of requiredEnvVars.server) {
      if (serverEnv.includes(env)) {
        console.log(`✅ Server ${env} configured`);
      } else {
        console.log(`❌ Server ${env} missing`);
      }
    }
  } catch (error) {
    console.log("❌ Server .env file missing or inaccessible");
  }

  // Check client env
  try {
    const clientEnv = await fs.readFile(
      path.join(process.cwd(), "client/.env"),
      "utf8"
    );
    for (const env of requiredEnvVars.client) {
      if (clientEnv.includes(env)) {
        console.log(`✅ Client ${env} configured`);
      } else {
        console.log(`❌ Client ${env} missing`);
      }
    }
  } catch (error) {
    console.log("❌ Client .env file missing or inaccessible");
  }
}

async function runSystemCheck() {
  console.log("🚀 Starting ShopAuth System Check...");

  try {
    await checkServerStatus();
    await testAuthFlow();
    await checkRequiredFiles();
    await checkEnvironmentVariables();
    await checkFrontendBuild();

    console.log("\n✨ System check completed!");
  } catch (error) {
    console.error("\n❌ System check failed:", error.message);
    process.exit(1);
  }
}

runSystemCheck();
