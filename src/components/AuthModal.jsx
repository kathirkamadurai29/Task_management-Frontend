import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setUsername('testdev');
    setPassword('password123');
    setTab('login');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!username.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (tab === 'login') {
        const result = await authService.login(username, password);
        onAuthSuccess(result.user);
        onClose();
      } else {
        if (!email.trim()) {
          setError('Email is required for registration');
          setLoading(false);
          return;
        }
        await authService.register(username, email, password);
        setSuccessMsg('Account registered successfully! Logging you in...');
        // Automatically log in after registration
        const result = await authService.login(username, password);
        setTimeout(() => {
          onAuthSuccess(result.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="auth-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-icon-badge">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>Welcome to TaskFlow</h3>
              <p className="auth-sub">FastAPI Backend Authentication</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setError('');
              setSuccessMsg('');
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setTab('register');
              setError('');
              setSuccessMsg('');
            }}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Quick Demo Credentials helper */}
        <div className="demo-credentials-banner">
          <span className="demo-text">Testing quickly? Use the pre-configured user:</span>
          <button type="button" className="demo-fill-btn" onClick={handleFillDemo}>
            Fill testdev
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="auth-alert alert-danger animate-fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert alert-success animate-fade-in">
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <User size={15} className="input-icon" />
              <input
                type="text"
                className="form-input input-padded"
                placeholder="Username (e.g. testdev)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="form-group animate-slide-up">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  className="form-input input-padded"
                  placeholder="user@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                type="password"
                className="form-input input-padded"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : tab === 'login' ? (
              <>
                <LogIn size={16} />
                <span>Sign In to TaskFlow</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
