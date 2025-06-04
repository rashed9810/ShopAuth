# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or login

## 2. Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier
3. Select your preferred cloud provider and region
4. Click "Create"

## 3. Set Up Database Access

1. Go to Security > Database Access
2. Click "Add New Database User"
3. Choose Username/Password authentication
4. Set username and a secure password
5. Set role to "Atlas admin"
6. Click "Add User"

## 4. Configure Network Access

1. Go to Security > Network Access
2. Click "Add IP Address"
3. For development: Add your current IP
4. For production: Add your server's IP or `0.0.0.0/0` for all IPs
5. Click "Confirm"

## 5. Get Connection String

1. Go to Deployment > Database
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

## 6. Update Environment Variables

1. Replace the placeholder values in your .env files:

For development (.env):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopauth?retryWrites=true&w=majority
```

For production (.env.production):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopauth-prod?retryWrites=true&w=majority
```

## 7. Migrate Data (Optional)

Run the migration script:

```bash
cd server/scripts
node db-migrate.js
```

## Security Best Practices

- Use strong passwords
- Regularly rotate database user credentials
- Enable IP whitelist in production
- Enable MongoDB Atlas backup service
- Monitor database metrics in Atlas dashboard
