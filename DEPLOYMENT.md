# Deployment Guide for ShopAuth

This guide will help you deploy the ShopAuth application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account and cluster
2. Create a database user with read/write permissions
3. Get your connection string (it should look like):
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

## Step 2: Deploy Backend (API) to Vercel

1. **Create a new Vercel project for the backend:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set the **Root Directory** to `server`
   - Set the **Framework Preset** to "Other"

2. **Configure Environment Variables:**
   Add these environment variables in Vercel dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key
   JWT_REFRESH_SECRET=your_super_secure_refresh_jwt_secret_key
   COOKIE_DOMAIN=.vercel.app
   ```

3. **Deploy the backend**
   - The backend will be available at something like: `https://shopauth-api.vercel.app`

## Step 3: Deploy Frontend (Client) to Vercel

1. **Create another Vercel project for the frontend:**
   - Click "New Project" again
   - Import the same GitHub repository
   - Set the **Root Directory** to the root folder (not client)
   - Set the **Framework Preset** to "Vite"

2. **Configure Environment Variables:**
   Add this environment variable:
   ```
   VITE_API_URL=https://your-backend-deployment-url.vercel.app/api
   ```
   Replace `your-backend-deployment-url` with your actual backend URL from Step 2.

3. **Deploy the frontend**
   - The frontend will be available at something like: `https://shopauth.vercel.app`

## Step 4: Update CORS Configuration

1. Update the backend's CORS configuration to include your frontend URL
2. In `server/api/index.js`, make sure your frontend URL is in the `allowedOrigins` array

## Step 5: Test the Deployment

1. Visit your frontend URL
2. Try to sign up for a new account
3. Test the subdomain functionality by creating shops
4. Verify that authentication works properly

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your frontend URL is added to the CORS configuration
2. **Database Connection**: Verify your MongoDB Atlas connection string and IP whitelist
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Build Errors**: Check the build logs in Vercel dashboard

### Environment Variables Checklist:

**Backend:**
- [ ] NODE_ENV=production
- [ ] MONGODB_URI (MongoDB Atlas connection string)
- [ ] JWT_SECRET (strong random string)
- [ ] JWT_REFRESH_SECRET (strong random string)
- [ ] COOKIE_DOMAIN=.vercel.app

**Frontend:**
- [ ] VITE_API_URL (your backend deployment URL + /api)

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain in Vercel dashboard
2. Update the CORS configuration to include your custom domain
3. Update the COOKIE_DOMAIN environment variable to your domain

## Security Notes

- Always use strong, random JWT secrets
- Keep your MongoDB credentials secure
- Use HTTPS in production (Vercel provides this automatically)
- Regularly rotate your JWT secrets
