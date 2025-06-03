import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Store, User, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopDashboard = () => {
  const { verifyShopAccess, isAuthenticated, loading: authLoading } = useAuth();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const getShopNameFromSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    
    if (parts.length >= 2 && (parts[1] === 'localhost' || parts[1] === '127')) {
      return parts[0];
    }
    

    if (parts.length >= 3) {
      return parts[0];
    }
    
    return null;
  };

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        setLoading(true);
        setError(null);

        const shopName = getShopNameFromSubdomain();
        
        if (!shopName) {
          setError('Invalid shop URL');
          return;
        }

        if (!isAuthenticated) {
          setError('Please login to access this shop');
          return;
        }

        const response = await verifyShopAccess(shopName);
        
        if (response.success) {
          setShopData({
            shopName: response.shop.name,
            description: response.shop.description,
            owner: response.shop.owner
          });
        }
      } catch (error) {
        console.error('Shop verification error:', error);
        
        if (error.response?.status === 403) {
          setError('You do not have access to this shop');
        } else if (error.response?.status === 401) {
          setError('Please login to access this shop');
        } else {
          setError('Failed to load shop. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    
    if (!authLoading) {
      verifyAccess();
    }
  }, [isAuthenticated, authLoading, verifyShopAccess]);

  const handleBackToDashboard = () => {
  
    const currentHost = window.location.host;
    const protocol = window.location.protocol;
    
    if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
      window.location.href = `${protocol}//localhost:5173/dashboard`;
    } else {
    
      const parts = currentHost.split('.');
      const mainDomain = parts.slice(1).join('.');
      window.location.href = `${protocol}//${mainDomain}/dashboard`;
    }
  };

  
  if (authLoading || loading) {
    return <LoadingSpinner message="Verifying shop access..." />;
  }

  
  if (error) {
    return (
      <div className="shop-dashboard">
        <div className="shop-content">
          <AlertCircle size={64} style={{ marginBottom: '20px', opacity: 0.7 }} />
          <h1>Access Denied</h1>
          <p>{error}</p>
          <button 
            className="back-btn"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="shop-dashboard">
      <div className="shop-content fade-in">
        <Store size={80} style={{ marginBottom: '20px', opacity: 0.8 }} />
        
        <h1>This is {shopData?.shopName} shop</h1>
        
        <p>
          Welcome to your {shopData?.shopName} shop dashboard. 
          This is where you can manage your shop operations.
        </p>
        
        {shopData?.description && (
          <p style={{ fontSize: '1.1rem', marginTop: '15px', opacity: 0.8 }}>
            {shopData.description}
          </p>
        )}
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '10px',
          fontSize: '0.95rem'
        }}>
          <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Shop Owner: {shopData?.owner}
        </div>
        
        <button 
          className="back-btn"
          onClick={handleBackToDashboard}
          style={{ marginTop: '30px' }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ShopDashboard;
