import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Store, LogOut, ExternalLink } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-section')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  const handleShopClick = (shopName) => {
    
    const currentHost = window.location.host;
    const subdomain = `${shopName}.${currentHost}`;
    const protocol = window.location.protocol;
    
    
    if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
      window.open(`${protocol}//${shopName}.localhost:5173`, '_blank');
    } else {
      window.open(`${protocol}//${subdomain}`, '_blank');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <nav className="dashboard-nav">
            <h1 className="dashboard-title">Shop Manager</h1>
            
            <div className="profile-section">
              <button
                className="profile-btn"
                onClick={() => setShowProfile(!showProfile)}
                title="Profile"
              >
                <User size={24} />
              </button>
              
              {showProfile && (
                <div className="profile-dropdown">
                  <h3>Welcome, {user.username}!</h3>
                  
                  <div>
                    <h4 style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
                      Your Shops:
                    </h4>
                    <ul className="shop-list">
                      {user.shopNames?.map((shopName, index) => (
                        <li
                          key={index}
                          className="shop-item"
                          onClick={() => handleShopClick(shopName)}
                          title={`Visit ${shopName} shop`}
                        >
                          <Store size={16} />
                          <span style={{ textTransform: 'capitalize' }}>{shopName}</span>
                          <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    className="logout-btn"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <LogOut size={16} style={{ marginRight: '8px' }} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="container">
          <div className="welcome-section">
            <h2>Welcome to Your Dashboard</h2>
            <p>Manage your shops and explore your business empire</p>
          </div>

          <div className="shops-grid">
            {user.shopNames?.map((shopName, index) => (
              <div
                key={index}
                className="shop-card"
                onClick={() => handleShopClick(shopName)}
              >
                <Store size={48} style={{ marginBottom: '15px', opacity: 0.8 }} />
                <h3>{shopName}</h3>
                <p>Click to visit your shop</p>
              </div>
            ))}
          </div>

          {(!user.shopNames || user.shopNames.length === 0) && (
            <div style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>
              <Store size={64} style={{ opacity: 0.5, marginBottom: '20px' }} />
              <h3>No shops found</h3>
              <p>It looks like you don't have any shops yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Dashboard;
