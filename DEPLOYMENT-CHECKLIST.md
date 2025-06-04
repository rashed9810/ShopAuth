# 🚀 Vercel Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Setup
- [ ] Run `npm run setup-production` to generate production environment files
- [ ] Update `server/.env.production` with your MongoDB Atlas URI
- [ ] Update `client/.env.production` with your backend deployment URL

### 2. Local Testing
- [ ] Run `npm run test-deployment` to verify local setup
- [ ] Test authentication flow locally
- [ ] Test subdomain functionality locally
- [ ] Verify all API endpoints work

### 3. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster
- [ ] Create database user with read/write permissions
- [ ] Whitelist all IP addresses (0.0.0.0/0) for Vercel
- [ ] Get connection string

## Vercel Deployment Steps

### Backend Deployment (API)

1. **Create Vercel Project**
   - [ ] Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - [ ] Click "New Project"
   - [ ] Import your GitHub repository
   - [ ] Set **Root Directory** to `server`
   - [ ] Set **Framework Preset** to "Other"

2. **Environment Variables**
   Add these in Vercel dashboard:
   - [ ] `NODE_ENV=production`
   - [ ] `MONGODB_URI=your_mongodb_atlas_connection_string`
   - [ ] `JWT_SECRET=your_generated_jwt_secret`
   - [ ] `JWT_REFRESH_SECRET=your_generated_refresh_secret`
   - [ ] `COOKIE_DOMAIN=.vercel.app`
   - [ ] `FRONTEND_URL=https://your-frontend-url.vercel.app`

3. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Note the deployment URL (e.g., `https://shopauth-api.vercel.app`)

### Frontend Deployment (Client)

1. **Create Second Vercel Project**
   - [ ] Click "New Project" again
   - [ ] Import the same GitHub repository
   - [ ] Set **Root Directory** to root folder (not client)
   - [ ] Set **Framework Preset** to "Vite"

2. **Environment Variables**
   - [ ] `VITE_API_URL=https://your-backend-url.vercel.app/api`

3. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Note the deployment URL (e.g., `https://shopauth.vercel.app`)

## Post-Deployment Verification

### 1. Backend Testing
- [ ] Visit `https://your-backend-url.vercel.app/api/health`
- [ ] Verify response shows `"success": true`
- [ ] Check database connection status

### 2. Frontend Testing
- [ ] Visit your frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test shop creation
- [ ] Test subdomain navigation (if applicable)

### 3. CORS Verification
- [ ] Verify no CORS errors in browser console
- [ ] Test API calls from frontend
- [ ] Check network tab for successful requests

## Troubleshooting

### Common Issues and Solutions

**❌ CORS Errors**
- Update backend CORS configuration with your frontend URL
- Check environment variables are set correctly

**❌ Database Connection Failed**
- Verify MongoDB Atlas connection string
- Check IP whitelist includes 0.0.0.0/0
- Verify database user permissions

**❌ Authentication Not Working**
- Check JWT secrets are set in backend
- Verify cookie domain configuration
- Check HTTPS is enabled (Vercel provides this)

**❌ Build Failures**
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Check for syntax errors

**❌ API Routes Not Found**
- Verify vercel.json configuration
- Check API route structure
- Ensure all route files exist

### Environment Variables Debug

**Backend Required Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
COOKIE_DOMAIN=.vercel.app
FRONTEND_URL=https://...
```

**Frontend Required Variables:**
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

## Success Criteria

✅ **Deployment is successful when:**
- Backend health endpoint returns success
- Frontend loads without errors
- User can register and login
- API calls work from frontend
- No CORS errors in console
- Database operations work correctly

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Verify all environment variables
4. Test API endpoints directly
5. Check MongoDB Atlas logs

## Security Notes

- Never commit `.env` files to version control
- Use strong, random JWT secrets
- Keep MongoDB credentials secure
- Regularly rotate secrets
- Monitor deployment logs for security issues
