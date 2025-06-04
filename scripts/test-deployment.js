const axios = require('axios');
const chalk = require('chalk');

// Configuration
const LOCAL_API = 'http://localhost:5000/api';
const LOCAL_CLIENT = 'http://localhost:5173';

async function testLocalDeployment() {
  console.log(chalk.blue.bold('🧪 Testing Local Deployment Setup\n'));

  // Test 1: Backend Health Check
  try {
    console.log(chalk.yellow('Testing backend health...'));
    const health = await axios.get(`${LOCAL_API}/health`);
    if (health.data.success) {
      console.log(chalk.green('✅ Backend is running and healthy'));
      console.log(`   Database: ${health.data.database}`);
      console.log(`   Environment: ${health.data.environment}`);
    }
  } catch (error) {
    console.log(chalk.red('❌ Backend health check failed'));
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure the server is running: npm run server');
    return false;
  }

  // Test 2: Frontend Accessibility
  try {
    console.log(chalk.yellow('\nTesting frontend accessibility...'));
    const response = await axios.get(LOCAL_CLIENT);
    if (response.status === 200) {
      console.log(chalk.green('✅ Frontend is accessible'));
    }
  } catch (error) {
    console.log(chalk.red('❌ Frontend is not accessible'));
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure the client is running: npm run client');
    return false;
  }

  // Test 3: CORS Configuration
  try {
    console.log(chalk.yellow('\nTesting CORS configuration...'));
    const response = await axios.options(`${LOCAL_API}/health`, {
      headers: {
        'Origin': LOCAL_CLIENT,
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log(chalk.green('✅ CORS is properly configured'));
  } catch (error) {
    console.log(chalk.red('❌ CORS configuration issue'));
    console.log(`   Error: ${error.message}`);
  }

  // Test 4: Environment Variables
  console.log(chalk.yellow('\nChecking environment variables...'));
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  let envVarsOk = true;

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(chalk.green(`✅ ${envVar} is set`));
    } else {
      console.log(chalk.red(`❌ ${envVar} is missing`));
      envVarsOk = false;
    }
  });

  if (!envVarsOk) {
    console.log(chalk.yellow('   Check your .env file in the server directory'));
  }

  // Test 5: Database Connection
  try {
    console.log(chalk.yellow('\nTesting database connection...'));
    const health = await axios.get(`${LOCAL_API}/health`);
    if (health.data.database === 'connected') {
      console.log(chalk.green('✅ Database connection is working'));
    } else {
      console.log(chalk.red('❌ Database is not connected'));
    }
  } catch (error) {
    console.log(chalk.red('❌ Could not check database connection'));
  }

  console.log(chalk.blue.bold('\n🚀 Deployment Readiness Summary:'));
  console.log(chalk.white('If all tests pass, your application is ready for deployment!'));
  console.log(chalk.white('Follow the DEPLOYMENT.md guide for Vercel deployment steps.'));

  return true;
}

// Run the tests
testLocalDeployment().catch(error => {
  console.error(chalk.red('\nTest suite failed:'), error.message);
  process.exit(1);
});
