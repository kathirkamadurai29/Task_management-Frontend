import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import DashboardView from './components/DashboardView';
import TaskModal from './components/TaskModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { taskService } from './services/taskService';
import { authService } from './services/authService';
import {
  Sparkles,
  LogIn,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';
import './App.css';

export default function App() {
  // Global State
  const [user, setUser] = useState(() => authService.getCachedUser());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [currentView, setCurrentView] = useState('kanban'); // 'kanban' | 'list' | 'dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('taskflow_theme') || 'dark');
  const [toasts, setToasts] = useState([]);

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState('pending');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast Helper
  const addToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme Synchronizer
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      await taskService.getHealth();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  }, []);

  // Fetch Tasks
  const loadTasks = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      if (err.status === 401) {
        authService.logout();
        setUser(null);
        addToast('Session expired. Please sign in again.', 'error', 'Authentication');
      } else {
        addToast(err.message || 'Failed to load tasks', 'error', 'Error');
      }
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial Load
  useEffect(() => {
    checkHealth();
    // Validate current user token
    if (authService.isAuthenticated()) {
      authService
        .getMe()
        .then((userData) => {
          setUser(userData);
          loadTasks();
        })
        .catch(() => {
          authService.logout();
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [checkHealth, loadTasks]);

  // Task Operations
  const handleOpenCreateModal = (status = 'pending') => {
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('Please sign in to create and manage tasks.', 'info', 'Sign In Required');
      return;
    }
    setEditingTask(null);
    setDefaultColumnStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      // Update
      await taskService.updateTask(editingTask.id, taskData);
      addToast(`"${taskData.title}" was updated successfully.`, 'success', 'Task Updated');
    } else {
      // Create
      await taskService.createTask(taskData);
      addToast(`"${taskData.title}" was created successfully.`, 'success', 'Task Created');
    }
    await loadTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    // Optimistic Update for immediate UI responsiveness
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus });
      const statusLabel =
        newStatus === 'in_progress'
          ? 'In Progress'
          : newStatus === 'completed'
          ? 'Completed'
          : 'Pending';
      addToast(`Task moved to ${statusLabel}`, 'success');
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      addToast(err.message || 'Failed to update task status', 'error', 'Sync Error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${taskToDelete ? taskToDelete.title : 'this task'}"?`
    );
    if (!confirmDelete) return;

    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addToast('Task deleted successfully', 'info', 'Deleted');
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error', 'Error');
    }
  };

  // Auth Operations
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    addToast(`Welcome back, ${userData.username}!`, 'success', 'Signed In');
    loadTasks();
    checkHealth();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setTasks([]);
    addToast('You have been signed out.', 'info', 'Signed Out');
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchTitle = t.title ? t.title.toLowerCase().includes(query) : false;
    const matchDesc = t.description ? t.description.toLowerCase().includes(query) : false;
    const matchUser = t.assigned_to_username ? t.assigned_to_username.toLowerCase().includes(query) : false;
    return matchTitle || matchDesc || matchUser;
  });

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => handleOpenCreateModal('pending')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        user={user}
        onLogout={handleLogout}
        backendOnline={backendOnline}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        <div className="content-container">
          {/* Unauthenticated Welcome Banner */}
          {!user && (
            <div className="welcome-banner glass-panel animate-slide-up">
              <div className="banner-content">
                <div className="banner-icon">
                  <Sparkles size={24} />
                </div>
                <div className="banner-text">
                  <h3>Connected to FastAPI Backend</h3>
                  <p>
                    Sign in to access your synchronized tasks, move workflow stages, or use the pre-configured demo account.
                  </p>
                </div>
              </div>

              <div className="banner-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn size={16} />
                  <span>Sign In / Demo Login</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <span>Explore Live Metrics</span>
                </button>
              </div>
            </div>
          )}

          {/* View Routing */}
          {currentView === 'kanban' && (
            <KanbanBoard
              tasks={filteredTasks}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}

          {currentView === 'list' && (
            <ListView
              tasks={filteredTasks}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              onViewChange={setCurrentView}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        defaultStatus={defaultColumnStatus}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSettingsUpdated={() => {
          checkHealth();
          loadTasks();
        }}
      />

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
