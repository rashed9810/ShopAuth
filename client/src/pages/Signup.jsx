import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Store, Plus, X, AlertCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading, isAuthenticated } = useAuth();
  const [shopNames, setShopNames] = useState(['', '', '']);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors
  } = useForm();

  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const password = watch('password');

  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[0-9])/.test(value)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*])/.test(value)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return true;
  };

  const validateShopNames = () => {
    const filledShops = shopNames.filter(name => name.trim() !== '');
    
    if (filledShops.length < 3) {
      return 'You must provide at least 3 shop names';
    }
    
    if (filledShops.length > 4) {
      return 'You can provide maximum 4 shop names';
    }
    
    const uniqueShops = [...new Set(filledShops.map(name => name.toLowerCase().trim()))];
    if (uniqueShops.length !== filledShops.length) {
      return 'Shop names must be unique';
    }
    

    for (const shop of filledShops) {
      if (shop.trim().length < 2) {
        return 'Each shop name must be at least 2 characters long';
      }
      if (!/^[a-zA-Z0-9\s-_]+$/.test(shop.trim())) {
        return 'Shop names can only contain letters, numbers, spaces, hyphens, and underscores';
      }
    }
    
    return true;
  };

  const handleShopNameChange = (index, value) => {
    const newShopNames = [...shopNames];
    newShopNames[index] = value;
    setShopNames(newShopNames);
    
    
    if (errors.shopNames) {
      clearErrors('shopNames');
    }
  };

  const addShopName = () => {
    if (shopNames.length < 4) {
      setShopNames([...shopNames, '']);
    }
  };

  const removeShopName = (index) => {
    if (shopNames.length > 3) {
      const newShopNames = shopNames.filter((_, i) => i !== index);
      setShopNames(newShopNames);
    }
  };

  const onSubmit = async (data) => {
    
    const shopValidation = validateShopNames();
    if (shopValidation !== true) {
      setError('shopNames', { type: 'manual', message: shopValidation });
      return;
    }

    const filledShopNames = shopNames.filter(name => name.trim() !== '');
    
    const signupData = {
      username: data.username,
      password: data.password,
      shopNames: filledShopNames
    };

    const result = await signup(signupData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start managing your shops</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Username
            </label>
            <input
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Enter your username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters long'
                },
                maxLength: {
                  value: 30,
                  message: 'Username cannot exceed 30 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
            />
            {errors.username && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.username.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Password
            </label>
            <input
              type="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword
              })}
            />
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Shop Names Field */}
          <div className="form-group">
            <label className="form-label">
              <Store size={16} style={{ display: 'inline', marginRight: '5px' }} />
              Shop Names (3-4 required)
            </label>
            <div className={`shop-names-container ${errors.shopNames ? 'error' : ''}`}>
              {shopNames.map((shopName, index) => (
                <div key={index} className="shop-name-input">
                  <input
                    type="text"
                    placeholder={`Shop ${index + 1} name`}
                    value={shopName}
                    onChange={(e) => handleShopNameChange(index, e.target.value)}
                  />
                  {shopNames.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeShopName(index)}
                      title="Remove shop"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              {shopNames.length < 4 && (
                <button
                  type="button"
                  className="add-shop-btn"
                  onClick={addShopName}
                >
                  <Plus size={16} style={{ display: 'inline', marginRight: '5px' }} />
                  Add Shop Name
                </button>
              )}
            </div>
            {errors.shopNames && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.shopNames.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/signin">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
