# 🚀 Complete Vercel Deployment Guide for ShopAuth

This guide provides step-by-step instructions to deploy your MERN stack application to Vercel successfully.

## 📋 Prerequisites

- [x] Vercel account ([sign up here](https://vercel.com))
- [x] MongoDB Atlas account ([sign up here](https://mongodb.com/atlas))
- [x] GitHub repository with your code
- [x] Node.js 18+ installed locally

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create Database
1. Log into MongoDB Atlas
2. Create a new cluster (free tier is fine)
3. Create a database user with read/write permissions
4. **Important**: Add `0.0.0.0/0` to IP whitelist (for Vercel)

### 1.2 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password

Example: `mongodb+srv://username:password@cluster.mongodb.net/shopauth?retryWrites=true&w=majority`

## 🔧 Step 2: Prepare Your Code

### 2.1 Run Setup Script
```bash
npm run setup-production
```

This generates secure JWT secrets and environment templates.

### 2.2 Verify File Structure
```
your-repo/
├── client/          # React frontend
├── server/          # Express backend
├── vercel.json      # Frontend config
└── server/vercel.json # Backend config
```

## 🌐 Step 3: Deploy Backend (API)

### 3.1 Create Backend Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. **Important Settings**:
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

### 3.2 Set Environment Variables
In Vercel project settings, add these environment variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopauth?retryWrites=true&w=majority
JWT_SECRET=your_generated_jwt_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret
COOKIE_DOMAIN=.vercel.app
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 3.3 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://shopauth-api.vercel.app`)

## 🎨 Step 4: Deploy Frontend (Client)

### 4.1 Create Frontend Project
1. Create another new project in Vercel
2. Import the same GitHub repository
3. **Important Settings**:
   - **Root Directory**: Leave empty (root folder)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/dist`

### 4.2 Set Environment Variables
Add this environment variable:

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Replace `your-backend-url` with the actual URL from Step 3.3.

### 4.3 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL

## 🔄 Step 5: Update Cross-References

### 5.1 Update Backend Environment
1. Go to your backend Vercel project
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Redeploy the backend

### 5.2 Test the Deployment
1. Visit your frontend URL
2. Try to register a new account
3. Test login functionality
4. Check browser console for errors

## ✅ Verification Checklist

- [ ] Backend health endpoint responds: `https://your-backend-url.vercel.app/api/health`
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] No CORS errors in browser console
- [ ] Database operations work correctly

## 🐛 Common Issues & Solutions

### Issue: "CORS Error"
**Solution**: Verify `FRONTEND_URL` is set correctly in backend environment variables

### Issue: "Database Connection Failed"
**Solution**: 
- Check MongoDB Atlas connection string
- Ensure IP `0.0.0.0/0` is whitelisted
- Verify database user permissions

### Issue: "Build Failed"
**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: "Environment Variables Not Working"
**Solution**:
- Redeploy after setting environment variables
- Check variable names match exactly
- Ensure no extra spaces in values

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify all environment variables
4. Test API endpoints directly
5. Check MongoDB Atlas logs

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, random JWT secrets
- Regularly rotate JWT secrets
- Keep MongoDB credentials secure
- Use HTTPS in production (Vercel provides this automatically)
