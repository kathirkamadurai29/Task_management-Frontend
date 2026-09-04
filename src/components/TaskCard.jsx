import React, { useState } from 'react';
import {
  Clock,
  User,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './TaskCard.css';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getNextStatusAction = (currentStatus) => {
    if (currentStatus === 'pending') {
      return {
        next: 'in_progress',
        label: 'Start Task',
        icon: ArrowRight,
      };
    }
    if (currentStatus === 'in_progress') {
      return {
        next: 'completed',
        label: 'Complete',
        icon: CheckCircle2,
      };
    }
    if (currentStatus === 'completed') {
      return {
        next: 'pending',
        label: 'Reopen',
        icon: Clock,
      };
    }
    return null;
  };

  const nextAction = getNextStatusAction(task.status);
  const NextIcon = nextAction ? nextAction.icon : null;

  return (
    <div
      className={`task-card status-${task.status} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="task-card-header">
        <span className={`badge badge-${task.status}`}>
          {getStatusLabel(task.status)}
        </span>

        <div className="task-card-menu-wrap">
          <button
            className="task-card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Task options"
          >
            <MoreVertical size={15} />
          </button>

          {menuOpen && (
            <>
              <div
                className="task-card-backdrop"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="task-card-dropdown animate-slide-up">
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                >
                  <Edit2 size={13} />
                  <span>Edit Details</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item dropdown-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(task.id);
                  }}
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h4 className="task-card-title">{task.title}</h4>

      {task.description && (
        <div
          className={`task-card-description ${expanded ? 'expanded' : ''}`}
          onClick={() => setExpanded(!expanded)}
          title="Click to toggle description"
        >
          {task.description}
        </div>
      )}

      <div className="task-card-meta">
        {/* Assignee / Creator info */}
        <div className="task-users">
          {task.assigned_to_username ? (
            <div className="user-tag" title={`Assigned to: ${task.assigned_to_username}`}>
              <div className="user-mini-avatar">
                {task.assigned_to_username.charAt(0).toUpperCase()}
              </div>
              <span className="user-tag-name">{task.assigned_to_username}</span>
            </div>
          ) : (
            <span className="unassigned-tag">Unassigned</span>
          )}

          {task.creator_username && (
            <span className="creator-subtext" title={`Created by ${task.creator_username}`}>
              by {task.creator_username}
            </span>
          )}
        </div>

        {/* Date */}
        {task.created_at && (
          <div className="task-date" title={`Created: ${new Date(task.created_at).toLocaleString()}`}>
            <Clock size={12} />
            <span>{formatDate(task.created_at)}</span>
          </div>
        )}
      </div>

      {/* Quick Move Action */}
      {nextAction && (
        <div className="task-card-footer">
          <button
            className="quick-advance-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, nextAction.next);
            }}
          >
            <span>{nextAction.label}</span>
            <NextIcon size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
