# MERN Shop Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with subdomain-based shop management, featuring secure authentication, session handling, and cross-subdomain access.

## 🚀 Features

### Authentication System

- **Secure Signup**: Username validation, strong password requirements (8+ chars, 1 number, 1 special char)
- **Smart Signin**: "Remember Me" functionality (7 days vs 30 minutes session)
- **JWT-based Auth**: Access tokens with automatic refresh mechanism
- **Cross-subdomain Sessions**: Authentication preserved across all shop subdomains

### Shop Management

- **Unique Shop Names**: Global namespace - no duplicate shop names across users
- **3-4 Shop Requirement**: Users must create 3-4 shops during signup
- **Dynamic Subdomains**: Each shop accessible via `http://<shopname>.localhost:5173`
- **Shop Verification**: Secure access control for shop-specific dashboards

### User Interface

- **Modern Design**: Beautiful, responsive UI with gradient backgrounds
- **Loading States**: Smooth loading spinners and transitions
- **Error Handling**: Comprehensive error messages and validation
- **Profile Management**: Easy access to shops and logout functionality

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** configured for subdomain support

### Frontend

- **React 18** with Vite
- **React Router DOM** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-shop-app.git
cd mern-shop-app
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_REFRESH_SECRET
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

### 5. Run the Application

```bash
# Start both server and client concurrently
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application

- **Main App**: `http://localhost:5173`
- **Shop Subdomains**: `http://<shopname>.localhost:5173`

## 🌐 Live Demo

- **Frontend**: [Demo Link](https://your-demo-link.vercel.app)
- **Backend API**: [API Link](https://your-api-link.herokuapp.com)

### Demo Credentials

```
Username: demo_user
Password: Demo123!
Shop Names: beautyhub, grocerypoint, techstore
```

## 📁 Project Structure

```
mern-shop-app/
├── server/                 # Backend application
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Express server setup
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── styles/        # CSS styles
│   │   └── App.jsx        # Main app component
│   └── public/            # Static assets
├── .env.example           # Environment template
├── package.json           # Root package.json
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/user/profile` - Get user profile
- `GET /api/user/shops` - Get user's shops
- `GET /api/user/verify-shop/:shopName` - Verify shop access

## 🔐 Security Features

### Password Requirements

- Minimum 8 characters
- At least 1 number
- At least 1 special character (!@#$%^&\*)

### Session Management

- **Regular Login**: 30-minute sessions
- **Remember Me**: 7-day sessions
- **Automatic Refresh**: Seamless token renewal
- **Cross-subdomain**: Sessions work across all shop subdomains

### Data Validation

- Server-side validation for all inputs
- Unique shop name enforcement
- Username format validation
- Password strength validation

## 🌐 Subdomain Configuration

### Development Setup

The application automatically handles subdomains in development:

- Main app: `localhost:5173`
- Shop subdomains: `<shopname>.localhost:5173`

### Production Deployment

For production, configure your DNS to point subdomains to your server:

```
A record: yourdomain.com → your-server-ip
CNAME: *.yourdomain.com → yourdomain.com
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB connection is configured
3. Set `NODE_ENV=production`
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or serve with Express
3. Configure subdomain routing on your hosting platform

## 🧪 Testing

### Manual Testing Checklist

- [ ] User signup with valid/invalid data
- [ ] User signin with remember me option
- [ ] Shop name uniqueness validation
- [ ] Dashboard profile functionality
- [ ] Subdomain navigation
- [ ] Cross-subdomain authentication
- [ ] Logout confirmation
- [ ] Session expiration handling

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Subdomain Not Working**

- Ensure you're using `localhost` not `127.0.0.1`
- Clear browser cache and cookies
- Check CORS configuration in server

**Authentication Issues**

- Verify JWT secrets are set in .env
- Check cookie settings in browser
- Ensure server and client are on same domain

## 📝 Environment Variables

| Variable             | Description               | Example                                   |
| -------------------- | ------------------------- | ----------------------------------------- |
| `MONGODB_URI`        | MongoDB connection string | `mongodb://localhost:27017/mern-shop-app` |
| `JWT_SECRET`         | Secret for access tokens  | `your-secret-key`                         |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | `your-refresh-secret`                     |
| `PORT`               | Server port               | `5000`                                    |
| `NODE_ENV`           | Environment mode          | `development`                             |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All open-source contributors

---

**Happy Coding! 🎉**
