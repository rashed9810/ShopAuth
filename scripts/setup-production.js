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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopauth?retryWrites=true&w=majority

# JWT Configuration (Auto-generated secure secrets)
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}

# Cookie Configuration
COOKIE_DOMAIN=.vercel.app

# Frontend URL
FRONTEND_URL=https://shopauth.vercel.app

# Instructions:
# 1. Replace the MONGODB_URI with your actual MongoDB Atlas connection string
# 2. Update FRONTEND_URL with your actual frontend deployment URL
# 3. Keep the JWT secrets secure and never commit them to version control
`;

  // Client production environment
  const clientEnvContent = `# Production API Configuration
VITE_API_URL=https://shopauth-api.vercel.app/api

# Instructions:
# Replace the API URL with your actual backend deployment URL
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
    console.log(chalk.white('\nBackend Environment Variables:'));
    console.log(`NODE_ENV=production`);
    console.log(`MONGODB_URI=your_mongodb_atlas_uri`);
    console.log(`JWT_SECRET=${jwtSecret}`);
    console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
    console.log(`COOKIE_DOMAIN=.vercel.app`);
    console.log(`FRONTEND_URL=https://your-frontend-url.vercel.app`);

    console.log(chalk.white('\nFrontend Environment Variables:'));
    console.log(`VITE_API_URL=https://your-backend-url.vercel.app/api`);

  } catch (error) {
    console.error(chalk.red('❌ Error creating production environment files:'), error.message);
    process.exit(1);
  }
}

// Run the setup
createProductionEnv();
