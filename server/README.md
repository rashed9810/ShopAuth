# ShopAuth Server

This is the backend server for the ShopAuth application.

## Prerequisites

- Node.js >= 14.0.0
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

## Development

To start the development server:
```bash
npm run dev
```

## Production Deployment

1. Set up environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI` = Your production MongoDB URI
   - `JWT_SECRET` = Strong secret for JWT tokens
   - `JWT_REFRESH_SECRET` = Strong secret for refresh tokens
   - `COOKIE_DOMAIN` = Your production domain

2. Install PM2 globally:
```bash
npm install -g pm2
```

3. Start the server with PM2:
```bash
pm2 start server.js --name shopauth-api
```

4. Configure your reverse proxy (Nginx/Apache) with SSL/TLS

## API Documentation

### Authentication Endpoints

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login
- POST `/api/auth/refresh` - Refresh access token
- POST `/api/auth/signout` - Logout

### User Endpoints

- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update user profile

### Health Check

- GET `/api/health` - Check server status
