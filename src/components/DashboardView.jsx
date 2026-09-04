import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Activity,
  Users,
  Layers,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { taskService } from '../services/taskService';
import './DashboardView.css';

export default function DashboardView({
  tasks,
  onViewChange,
  onOpenCreateModal,
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await taskService.getDashboard();
      setStats(data);
    } catch {
      // Fallback calculation from local tasks if dashboard endpoint fails
      const pending = tasks.filter((t) => t.status === 'pending').length;
      const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
      const completed = tasks.filter((t) => t.status === 'completed').length;
      setStats({
        total_tasks: tasks.length,
        pending_tasks: pending,
        in_progress_tasks: inProgress,
        completed_tasks: completed,
        total_users: 1,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [tasks]);

  const totalTasks = stats?.total_tasks || 0;
  const completedTasks = stats?.completed_tasks || 0;
  const inProgressTasks = stats?.in_progress_tasks || 0;
  const pendingTasks = stats?.pending_tasks || 0;
  const totalUsers = stats?.total_users || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressRate =
    totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const pendingRate =
    totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;

  // Circular progress calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Header with Title and Refresh */}
      <div className="dashboard-header glass-panel">
        <div>
          <h2 className="dashboard-title">System Analytics & Dashboard</h2>
          <p className="dashboard-subtitle">
            Real-time workflow telemetry powered by FastAPI & PostgreSQL/SQLite
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchStats}
            disabled={refreshing}
            title="Refresh statistics from backend"
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            <span>{refreshing ? 'Updating...' : 'Sync Live'}</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpenCreateModal('pending')}
          >
            <Plus size={14} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Tasks */}
        <div className="kpi-card glass-panel kpi-total">
          <div className="kpi-icon-wrap icon-total">
            <Layers size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Workload</span>
            <div className="kpi-value">{totalTasks}</div>
            <span className="kpi-hint">Tasks tracked in database</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="kpi-card glass-panel kpi-pending">
          <div className="kpi-icon-wrap icon-pending">
            <Clock size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Pending Review</span>
            <div className="kpi-value">{pendingTasks}</div>
            <span className="kpi-hint">{pendingRate}% of total queue</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="kpi-card glass-panel kpi-progress">
          <div className="kpi-icon-wrap icon-progress">
            <Activity size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Sprints</span>
            <div className="kpi-value">{inProgressTasks}</div>
            <span className="kpi-hint">{inProgressRate}% currently underway</span>
          </div>
        </div>

        {/* Completed */}
        <div className="kpi-card glass-panel kpi-completed">
          <div className="kpi-icon-wrap icon-completed">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Completed</span>
            <div className="kpi-value">{completedTasks}</div>
            <span className="kpi-hint">{completionRate}% finished</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="kpi-card glass-panel kpi-users">
          <div className="kpi-icon-wrap icon-users">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">System Users</span>
            <div className="kpi-value">{totalUsers}</div>
            <span className="kpi-hint">Collaborators registered</span>
          </div>
        </div>
      </div>

      {/* Deep Dive Section: Circular Gauge & Workload Distribution */}
      <div className="analytics-details-grid">
        {/* Completion Gauge */}
        <div className="analytics-card glass-panel">
          <div className="card-header">
            <div className="header-icon-label">
              <Sparkles size={18} className="sparkle-icon" />
              <h3>Completion Velocity</h3>
            </div>
            <span className="rate-badge">{completionRate}% Done</span>
          </div>

          <div className="gauge-wrapper">
            <svg className="progress-ring" width="160" height="160">
              <circle
                className="progress-ring-bg"
                strokeWidth="12"
                fill="transparent"
                r={radius}
                cx="80"
                cy="80"
              />
              <circle
                className="progress-ring-fill"
                strokeWidth="12"
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="80"
                cy="80"
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-percentage">{completionRate}%</span>
              <span className="gauge-sub">Efficiency</span>
            </div>
          </div>

          <div className="gauge-footer-stats">
            <div className="gauge-stat-item">
              <span className="dot dot-completed"></span>
              <span>Finished: {completedTasks}</span>
            </div>
            <div className="gauge-stat-item">
              <span className="dot dot-progress"></span>
              <span>Active: {inProgressTasks}</span>
            </div>
            <div className="gauge-stat-item">
              <span className="dot dot-pending"></span>
              <span>Pending: {pendingTasks}</span>
            </div>
          </div>
        </div>

        {/* Workflow Stage Distribution */}
        <div className="analytics-card glass-panel">
          <div className="card-header">
            <div className="header-icon-label">
              <BarChart3 size={18} className="sparkle-icon" />
              <h3>Status Distribution</h3>
            </div>
          </div>

          <div className="distribution-bars">
            {/* Multi-segment visual bar */}
            <div className="segmented-bar-wrapper">
              <div
                className="seg-bar seg-completed"
                style={{ width: `${completionRate}%` }}
                title={`Completed: ${completionRate}%`}
              />
              <div
                className="seg-bar seg-progress"
                style={{ width: `${inProgressRate}%` }}
                title={`In Progress: ${inProgressRate}%`}
              />
              <div
                className="seg-bar seg-pending"
                style={{ width: `${pendingRate}%` }}
                title={`Pending: ${pendingRate}%`}
              />
            </div>

            {/* Stage Breakdowns */}
            <div className="breakdown-list">
              <div className="breakdown-item">
                <div className="item-info">
                  <div className="item-badge-wrap">
                    <span className="dot dot-completed"></span>
                    <span className="item-title">Completed Tasks</span>
                  </div>
                  <span className="item-count">{completedTasks} tasks</span>
                </div>
                <div className="mini-progress-track">
                  <div
                    className="mini-progress-fill fill-completed"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="item-info">
                  <div className="item-badge-wrap">
                    <span className="dot dot-progress"></span>
                    <span className="item-title">In Progress Tasks</span>
                  </div>
                  <span className="item-count">{inProgressTasks} tasks</span>
                </div>
                <div className="mini-progress-track">
                  <div
                    className="mini-progress-fill fill-progress"
                    style={{ width: `${inProgressRate}%` }}
                  />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="item-info">
                  <div className="item-badge-wrap">
                    <span className="dot dot-pending"></span>
                    <span className="item-title">Pending Tasks</span>
                  </div>
                  <span className="item-count">{pendingTasks} tasks</span>
                </div>
                <div className="mini-progress-track">
                  <div
                    className="mini-progress-fill fill-pending"
                    style={{ width: `${pendingRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick jump to Kanban */}
          <div className="card-quick-action">
            <button
              className="btn btn-secondary btn-sm full-width"
              onClick={() => onViewChange('kanban')}
            >
              <span>Manage on Kanban Board</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
