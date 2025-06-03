import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import ShopDashboard from './pages/ShopDashboard';

function App() {
  
  const isSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    
    if (parts.length >= 2 && (parts[1] === 'localhost' || parts[1] === '127')) {
      return parts[0] !== 'localhost' && parts[0] !== '127';
    }
    
    
    if (parts.length >= 3) {
      return true;
    }
    
    return false;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '14px'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            
            {isSubdomain() ? (
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <ShopDashboard />
                  </ProtectedRoute>
                } 
              />
            ) : (
              
              <>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
