import React, { useState, useEffect } from 'react';
import {
  Layers,
  Kanban,
  ListTodo,
  BarChart3,
  Search,
  Plus,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Server,
  User as UserIcon,
  X,
  Settings
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenAuthModal,
  onOpenSettingsModal,
  user,
  onLogout,
  backendOnline,
  theme,
  onToggleTheme,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        {/* Left: Brand & Backend Status */}
        <div className="navbar-brand-section">
          <div className="brand-logo" onClick={() => onViewChange('kanban')}>
            <div className="brand-icon">
              <Layers size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-title">TaskFlow</span>
              <span className="brand-badge">FastAPI</span>
            </div>
          </div>

          <button
            className={`status-pill ${backendOnline ? 'status-online' : 'status-offline'}`}
            onClick={onOpenSettingsModal}
            title={backendOnline ? 'Connected to FastAPI (127.0.0.1:8000). Click for settings.' : 'Backend unreachable. Click to check settings.'}
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {backendOnline ? 'Backend 8000' : 'Disconnected'}
            </span>
          </button>
        </div>

        {/* Center: Search & Navigation Switcher */}
        <div className="navbar-center-section">
          {/* View Switcher */}
          <nav className="view-switcher" aria-label="Views">
            <button
              className={`view-btn ${currentView === 'kanban' ? 'active' : ''}`}
              onClick={() => onViewChange('kanban')}
              title="Kanban Board View"
            >
              <Kanban size={16} />
              <span>Kanban</span>
            </button>
            <button
              className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => onViewChange('list')}
              title="List View"
            >
              <ListTodo size={16} />
              <span>List</span>
            </button>
            <button
              className={`view-btn ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onViewChange('dashboard')}
              title="Analytics Dashboard"
            >
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Search Input */}
          <div className="navbar-search">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="navbar-actions-section">
          <button
            className="btn btn-primary btn-sm new-task-btn"
            onClick={onOpenCreateModal}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>

          <button
            className="btn btn-ghost btn-icon theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn btn-ghost btn-icon settings-btn"
            onClick={onOpenSettingsModal}
            title="Backend Settings"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {/* Auth State */}
          {user ? (
            <div className="user-menu-wrapper">
              <button
                className="user-avatar-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user.username}</span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown-menu animate-slide-up">
                  <div className="user-dropdown-header">
                    <div className="dropdown-username">{user.username}</div>
                    <div className="dropdown-email">{user.email || 'User ID: ' + user.id}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item dropdown-logout"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-secondary btn-sm auth-btn"
              onClick={onOpenAuthModal}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
