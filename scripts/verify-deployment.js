const axios = require('axios');
const chalk = require('chalk');

// Configuration - Update these with your actual deployment URLs
const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-url.vercel.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-frontend-url.vercel.app';

async function verifyDeployment() {
  console.log(chalk.blue.bold('🔍 Verifying Deployment...\n'));

  let allTestsPassed = true;

  // Test 1: Backend Health Check
  console.log(chalk.yellow('1. Testing Backend Health...'));
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 10000
    });
    
    if (response.data.success) {
      console.log(chalk.green('✅ Backend health check passed'));
      console.log(chalk.gray(`   Database: ${response.data.database}`));
      console.log(chalk.gray(`   Environment: ${response.data.environment}`));
    } else {
      console.log(chalk.red('❌ Backend health check failed'));
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Backend health check failed'));
    console.log(chalk.red(`   Error: ${error.message}`));
    allTestsPassed = false;
  }

  // Test 2: Frontend Accessibility
  console.log(chalk.yellow('\n2. Testing Frontend Accessibility...'));
  try {
    const response = await axios.get(FRONTEND_URL, {
      timeout: 10000
    });
    
    if (response.status === 200) {
      console.log(chalk.green('✅ Frontend is accessible'));
    } else {
      console.log(chalk.red('❌ Frontend accessibility failed'));
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(chalk.red('❌ Frontend accessibility failed'));
    console.log(chalk.red(`   Error: ${error.message}`));
    allTestsPassed = false;
  }

  // Test 3: CORS Configuration
  console.log(chalk.yellow('\n3. Testing CORS Configuration...'));
  try {
    const response = await axios.options(`${BACKEND_URL}/api/health`, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET'
      },
      timeout: 10000
    });
    
    console.log(chalk.green('✅ CORS configuration appears correct'));
  } catch (error) {
    if (error.response && error.response.status === 204) {
      console.log(chalk.green('✅ CORS configuration appears correct'));
    } else {
      console.log(chalk.red('❌ CORS configuration may have issues'));
      console.log(chalk.red(`   Error: ${error.message}`));
      allTestsPassed = false;
    }
  }

  // Test 4: API Endpoints
  console.log(chalk.yellow('\n4. Testing API Endpoints...'));
  try {
    // Test auth endpoints exist (should return method not allowed or similar)
    const authResponse = await axios.get(`${BACKEND_URL}/api/auth/signup`, {
      timeout: 10000,
      validateStatus: () => true // Accept any status code
    });
    
    if (authResponse.status === 404) {
      console.log(chalk.red('❌ Auth endpoints not found'));
      allTestsPassed = false;
    } else {
      console.log(chalk.green('✅ API endpoints are accessible'));
    }
  } catch (error) {
    console.log(chalk.red('❌ API endpoints test failed'));
    console.log(chalk.red(`   Error: ${error.message}`));
    allTestsPassed = false;
  }

  // Summary
  console.log(chalk.blue.bold('\n📊 Deployment Verification Summary:'));
  if (allTestsPassed) {
    console.log(chalk.green.bold('🎉 All tests passed! Your deployment looks good.'));
    console.log(chalk.white('\n🔗 Your URLs:'));
    console.log(chalk.cyan(`Frontend: ${FRONTEND_URL}`));
    console.log(chalk.cyan(`Backend:  ${BACKEND_URL}/api`));
  } else {
    console.log(chalk.red.bold('❌ Some tests failed. Please check the issues above.'));
    console.log(chalk.yellow('\n💡 Common solutions:'));
    console.log(chalk.white('- Verify environment variables are set correctly'));
    console.log(chalk.white('- Check Vercel deployment logs'));
    console.log(chalk.white('- Ensure MongoDB Atlas is configured properly'));
    console.log(chalk.white('- Verify CORS settings include your frontend URL'));
  }

  console.log(chalk.gray('\n📖 For detailed troubleshooting, see VERCEL-DEPLOYMENT-GUIDE.md'));
}

// Run verification
if (require.main === module) {
  verifyDeployment().catch(error => {
    console.error(chalk.red('Verification script failed:'), error.message);
    process.exit(1);
  });
}

module.exports = verifyDeployment;
