import React, { useState, useEffect } from 'react';
import { X, Check, Layers, AlertCircle, User } from 'lucide-react';
import './TaskModal.css';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  defaultStatus = 'pending',
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || defaultStatus);
      setAssignedTo(initialData.assigned_to ? String(initialData.assigned_to) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'pending');
      setAssignedTo('');
    }
    setError('');
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        status,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-icon-badge">
              <Layers size={18} />
            </div>
            <h3>{initialData ? 'Edit Task' : 'Create New Task'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="modal-error-alert animate-fade-in">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g., Implement OAuth Authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description / Notes
            </label>
            <textarea
              id="task-desc"
              className="form-textarea"
              placeholder="Add key context, requirements, or steps to complete..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status & Assigned To */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="task-status" className="form-label">
                Initial Workflow State
              </label>
              <select
                id="task-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-assignee" className="form-label">
                Assigned User ID <span className="optional-tag">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <User size={15} className="input-icon" />
                <input
                  id="task-assignee"
                  type="number"
                  className="form-input input-padded"
                  placeholder="e.g., 1 or 2"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Check size={16} />
              <span>{submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
