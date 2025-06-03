import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, loading, isAuthenticated } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data) => {
    const result = await signin(data);
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your shops</p>
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
                required: 'Username is required'
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
                required: 'Password is required'
              })}
            />
            {errors.password && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="rememberMe"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe">
              Remember me for 7 days
            </label>
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
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
