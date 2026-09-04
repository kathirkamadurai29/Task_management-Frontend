import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  Trash2,
  ArrowUpDown,
  Filter,
  Plus,
  Inbox
} from 'lucide-react';
import './ListView.css';

export default function ListView({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenCreateModal,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [tasks, statusFilter, sortBy]);

  const toggleTaskCompletion = (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, nextStatus);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="list-view-container animate-fade-in">
      {/* List Toolbar Controls */}
      <div className="list-toolbar glass-panel">
        <div className="toolbar-left">
          <div className="filter-group">
            <Filter size={15} className="filter-icon" />
            <span className="toolbar-label">Status:</span>
            <div className="filter-pills">
              {['all', 'pending', 'in_progress', 'completed'].map((status) => (
                <button
                  key={status}
                  className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all'
                    ? 'All'
                    : status === 'in_progress'
                    ? 'In Progress'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="sort-group">
            <ArrowUpDown size={15} className="sort-icon" />
            <span className="toolbar-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpenCreateModal('pending')}
          >
            <Plus size={14} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task Rows */}
      <div className="list-table-container glass-panel">
        <div className="list-table-header">
          <div className="col col-check">Done</div>
          <div className="col col-title">Task</div>
          <div className="col col-status">Status</div>
          <div className="col col-assigned">Assignee</div>
          <div className="col col-date">Created</div>
          <div className="col col-actions">Actions</div>
        </div>

        <div className="list-table-body">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`list-table-row ${isCompleted ? 'row-completed' : ''}`}
                >
                  {/* Checkbox */}
                  <div className="col col-check">
                    <button
                      className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={() => toggleTaskCompletion(task)}
                      aria-label={`Mark task ${isCompleted ? 'incomplete' : 'complete'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="check-icon-active" />
                      ) : (
                        <Circle size={18} className="check-icon-idle" />
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="col col-title">
                    <div className="task-title-text">{task.title}</div>
                    {task.description && (
                      <div className="task-desc-text">{task.description}</div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="col col-status">
                    <select
                      className={`status-select status-select-${task.status}`}
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Assignee */}
                  <div className="col col-assigned">
                    {task.assigned_to_username ? (
                      <div className="assignee-badge">
                        <div className="assignee-avatar">
                          {task.assigned_to_username.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assigned_to_username}</span>
                      </div>
                    ) : (
                      <span className="unassigned-text">Unassigned</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col col-date">
                    <span className="date-text">{formatDate(task.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="col col-actions">
                    <button
                      className="row-action-btn"
                      onClick={() => onEditTask(task)}
                      title="Edit Task"
                      aria-label="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="row-action-btn row-action-delete"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete Task"
                      aria-label="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="list-empty-state">
              <Inbox size={32} className="empty-icon" />
              <h4>No tasks found</h4>
              <p>Try changing your filter criteria or create a new task.</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setStatusFilter('all')}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
