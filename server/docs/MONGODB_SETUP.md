# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account and Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project
4. Build a new cluster (Free tier is fine for starting)
5. Choose your preferred cloud provider and region

## 2. Configure Database Access

1. Go to Security → Database Access
2. Add a new database user
   - Choose Password authentication
   - Generate a secure password
   - Set user privileges to "Atlas admin"

## 3. Configure Network Access

1. Go to Security → Network Access
2. Add your application server's IP
3. For development, you can add your local IP
4. For Vercel deployment, add: `0.0.0.0/0`

## 4. Get Connection String

1. Go to Clusters → Connect
2. Choose "Connect your application"
3. Select Node.js as your driver
4. Copy the connection string
5. Replace `<password>` with your database user's password

## 5. Configure Environment Variables

Update your `.env.production` with:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopauth?retryWrites=true&w=majority
```

## 6. Database Indexing

Run these commands in MongoDB Atlas console for better performance:

```javascript
// Username index
db.users.createIndex({ "username": 1 }, { unique: true });

// Shop name index
db.shops.createIndex({ "name": 1 }, { unique: true });

// Owner index for shops
db.shops.createIndex({ "owner": 1 });
```

## 7. Backup Configuration

1. Enable backup in MongoDB Atlas:
   - Go to Clusters → ... → Back Up
   - Enable continuous backup
   - Set retention period

2. Use the backup script:
```bash
cd server/scripts
./backup.cmd
```

## 8. Monitoring

1. Enable MongoDB Atlas monitoring:
   - Go to Clusters → ... → Monitoring
   - Set up alerts for:
     - Connection count
     - Query performance
     - Storage capacity

2. Check application logs:
```bash
cd server/logs
```

## Security Best Practices

1. Use strong passwords
2. Enable IP whitelist in production
3. Regularly rotate database credentials
4. Monitor database access logs
5. Keep MongoDB version updated
