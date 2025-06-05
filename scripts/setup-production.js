const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

function createProductionEnv() {
  console.log(chalk.blue.bold('🔧 Setting up production environment files...\n'));

  // Generate secure secrets
  const jwtSecret = generateSecureSecret();
  const jwtRefreshSecret = generateSecureSecret();

  // Server production environment
  const serverEnvContent = `# Production Environment Configuration
NODE_ENV=production
PORT=5000

# MongoDB Configuration (UPDATE WITH YOUR ATLAS URI)
# Make sure to:
# 1. Replace username and password with your actual MongoDB Atlas credentials
# 2. Replace cluster name with your actual cluster name
# 3. Ensure your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for Vercel)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopauth?retryWrites=true&w=majority&ssl=true

# JWT Configuration (Auto-generated secure secrets)
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}

# Cookie Configuration
COOKIE_DOMAIN=.vercel.app

# Frontend URL (UPDATE WITH YOUR ACTUAL FRONTEND URL)
FRONTEND_URL=https://your-frontend-app.vercel.app

# Instructions:
# 1. Replace the MONGODB_URI with your actual MongoDB Atlas connection string
# 2. Update FRONTEND_URL with your actual frontend deployment URL
# 3. Keep the JWT secrets secure and never commit them to version control
# 4. Set these as environment variables in your Vercel backend project
`;

  // Client production environment
  const clientEnvContent = `# Production API Configuration
# UPDATE WITH YOUR ACTUAL BACKEND URL
VITE_API_URL=https://your-backend-app.vercel.app/api

# Instructions:
# 1. Replace the API URL with your actual backend deployment URL
# 2. Make sure the URL ends with /api
# 3. Set this as environment variable in your Vercel frontend project
`;

  try {
    // Write server production env
    fs.writeFileSync(path.join(__dirname, '../server/.env.production'), serverEnvContent);
    console.log(chalk.green('✅ Created server/.env.production'));

    // Write client production env
    fs.writeFileSync(path.join(__dirname, '../client/.env.production'), clientEnvContent);
    console.log(chalk.green('✅ Created client/.env.production'));

    console.log(chalk.yellow('\n⚠️  Important Next Steps:'));
    console.log(chalk.white('1. Update server/.env.production with your MongoDB Atlas URI'));
    console.log(chalk.white('2. Update client/.env.production with your backend deployment URL'));
    console.log(chalk.white('3. Never commit these files to version control'));
    console.log(chalk.white('4. Set these as environment variables in Vercel dashboard'));

    console.log(chalk.blue('\n📋 Environment Variables for Vercel:'));
    console.log(chalk.gray('Copy these to your Vercel project settings:'));

    console.log(chalk.white('\n🔧 Backend Environment Variables (for server deployment):'));
    console.log(chalk.cyan(`NODE_ENV=production`));
    console.log(chalk.cyan(`MONGODB_URI=your_mongodb_atlas_uri`));
    console.log(chalk.cyan(`JWT_SECRET=${jwtSecret}`));
    console.log(chalk.cyan(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`));
    console.log(chalk.cyan(`COOKIE_DOMAIN=.vercel.app`));
    console.log(chalk.cyan(`FRONTEND_URL=https://your-frontend-url.vercel.app`));

    console.log(chalk.white('\n🌐 Frontend Environment Variables (for client deployment):'));
    console.log(chalk.cyan(`VITE_API_URL=https://your-backend-url.vercel.app/api`));

    console.log(chalk.yellow('\n🚀 Deployment Steps:'));
    console.log(chalk.white('1. Create two separate Vercel projects:'));
    console.log(chalk.white('   - Backend: Set root directory to "server"'));
    console.log(chalk.white('   - Frontend: Set root directory to root folder'));
    console.log(chalk.white('2. Set environment variables in each project'));
    console.log(chalk.white('3. Deploy both projects'));
    console.log(chalk.white('4. Update URLs in environment variables'));
    console.log(chalk.white('5. Redeploy with correct URLs'));

  } catch (error) {
    console.error(chalk.red('❌ Error creating production environment files:'), error.message);
    process.exit(1);
  }
}

// Run the setup
createProductionEnv();
