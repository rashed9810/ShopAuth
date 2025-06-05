const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

function displayDeploymentInstructions() {
  console.log(chalk.blue.bold('🚀 ShopAuth Deployment Helper\n'));

  console.log(chalk.yellow('📋 Pre-Deployment Checklist:'));
  console.log(chalk.white('□ MongoDB Atlas cluster created'));
  console.log(chalk.white('□ Database user created with read/write permissions'));
  console.log(chalk.white('□ IP whitelist includes 0.0.0.0/0 for Vercel'));
  console.log(chalk.white('□ GitHub repository is up to date'));
  console.log(chalk.white('□ Vercel account is ready'));

  console.log(chalk.blue('\n🔧 Step 1: Prepare Environment'));
  console.log(chalk.cyan('npm run setup-production'));
  console.log(chalk.gray('This generates secure JWT secrets and environment templates'));

  console.log(chalk.blue('\n🌐 Step 2: Deploy Backend'));
  console.log(chalk.white('1. Go to https://vercel.com/dashboard'));
  console.log(chalk.white('2. Click "New Project"'));
  console.log(chalk.white('3. Import your GitHub repository'));
  console.log(chalk.white('4. Configure:'));
  console.log(chalk.cyan('   - Root Directory: server'));
  console.log(chalk.cyan('   - Framework: Other'));
  console.log(chalk.white('5. Set environment variables:'));
  console.log(chalk.gray('   NODE_ENV=production'));
  console.log(chalk.gray('   MONGODB_URI=your_atlas_connection_string'));
  console.log(chalk.gray('   JWT_SECRET=generated_secret'));
  console.log(chalk.gray('   JWT_REFRESH_SECRET=generated_secret'));
  console.log(chalk.gray('   COOKIE_DOMAIN=.vercel.app'));
  console.log(chalk.gray('   FRONTEND_URL=https://your-frontend.vercel.app'));
  console.log(chalk.white('6. Deploy'));

  console.log(chalk.blue('\n🎨 Step 3: Deploy Frontend'));
  console.log(chalk.white('1. Create another Vercel project'));
  console.log(chalk.white('2. Import the same GitHub repository'));
  console.log(chalk.white('3. Configure:'));
  console.log(chalk.cyan('   - Root Directory: (leave empty)'));
  console.log(chalk.cyan('   - Framework: Vite'));
  console.log(chalk.white('4. Set environment variable:'));
  console.log(chalk.gray('   VITE_API_URL=https://your-backend.vercel.app/api'));
  console.log(chalk.white('5. Deploy'));

  console.log(chalk.blue('\n🔄 Step 4: Update Cross-References'));
  console.log(chalk.white('1. Update backend FRONTEND_URL with actual frontend URL'));
  console.log(chalk.white('2. Redeploy backend'));
  console.log(chalk.white('3. Test the application'));

  console.log(chalk.blue('\n✅ Step 5: Verify Deployment'));
  console.log(chalk.cyan('BACKEND_URL=your-backend-url FRONTEND_URL=your-frontend-url npm run verify-deployment'));

  console.log(chalk.green.bold('\n🎉 Success Indicators:'));
  console.log(chalk.white('✓ Backend health endpoint responds'));
  console.log(chalk.white('✓ Frontend loads without errors'));
  console.log(chalk.white('✓ User registration works'));
  console.log(chalk.white('✓ No CORS errors in browser console'));

  console.log(chalk.yellow.bold('\n⚠️  Common Issues:'));
  console.log(chalk.white('• CORS errors → Check FRONTEND_URL in backend env vars'));
  console.log(chalk.white('• Database connection → Verify MongoDB Atlas setup'));
  console.log(chalk.white('• Build failures → Check Vercel deployment logs'));
  console.log(chalk.white('• 404 errors → Verify API routes and environment variables'));

  console.log(chalk.blue.bold('\n📚 Additional Resources:'));
  console.log(chalk.cyan('• Complete Guide: VERCEL-DEPLOYMENT-GUIDE.md'));
  console.log(chalk.cyan('• Fixes Summary: DEPLOYMENT-FIXES-SUMMARY.md'));
  console.log(chalk.cyan('• Troubleshooting: Check Vercel logs and browser console'));

  console.log(chalk.gray('\n💡 Tip: Keep your MongoDB Atlas and Vercel dashboards open during deployment'));
}

function checkFiles() {
  console.log(chalk.blue.bold('\n🔍 Checking Required Files...\n'));

  const requiredFiles = [
    'vercel.json',
    'server/vercel.json',
    'server/api/index.js',
    'client/vite.config.js',
    'package.json',
    'server/package.json'
  ];

  let allFilesExist = true;

  requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(chalk.green(`✅ ${file}`));
    } else {
      console.log(chalk.red(`❌ ${file} - MISSING`));
      allFilesExist = false;
    }
  });

  if (allFilesExist) {
    console.log(chalk.green.bold('\n🎉 All required files are present!'));
  } else {
    console.log(chalk.red.bold('\n❌ Some required files are missing. Please check the setup.'));
  }

  return allFilesExist;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--check') || args.includes('-c')) {
    checkFiles();
  } else {
    displayDeploymentInstructions();
    console.log(chalk.gray('\nRun with --check to verify required files exist'));
  }
}

if (require.main === module) {
  main();
}

module.exports = { displayDeploymentInstructions, checkFiles };
