import React, { useState } from 'react';
import { Plus, Clock, Activity, CheckCircle2, Inbox } from 'lucide-react';
import TaskCard from './TaskCard';
import './KanbanBoard.css';

const COLUMNS = [
  {
    id: 'pending',
    title: 'Pending',
    icon: Clock,
    colorClass: 'pending',
    emptyText: 'No pending tasks.',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Activity,
    colorClass: 'in_progress',
    emptyText: 'No tasks currently in progress.',
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    colorClass: 'completed',
    emptyText: 'No completed tasks yet.',
  },
];

export default function KanbanBoard({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenCreateModal,
}) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', String(task.id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    // Only clear if actually leaving column container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    const taskId = parseInt(taskIdStr, 10);

    if (!isNaN(taskId) && draggedTask && draggedTask.status !== columnId) {
      onStatusChange(taskId, columnId);
    }
    setDraggedTask(null);
  };

  return (
    <div className="kanban-board animate-fade-in">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;
        const isTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={`kanban-column glass-panel column-${column.colorClass} ${
              isTarget ? 'column-drag-over' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="kanban-column-header">
              <div className="column-title-group">
                <div className={`column-icon-wrap icon-${column.colorClass}`}>
                  <Icon size={16} />
                </div>
                <h3 className="column-title">{column.title}</h3>
                <span className={`column-count-badge badge-${column.colorClass}`}>
                  {columnTasks.length}
                </span>
              </div>

              <button
                className="column-add-btn"
                onClick={() => onOpenCreateModal(column.id)}
                title={`Add task to ${column.title}`}
                aria-label={`Add task to ${column.title}`}
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Task Cards Container */}
            <div className="kanban-task-list">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                    isDragging={draggedTask && draggedTask.id === task.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))
              ) : (
                <div className="empty-column-state">
                  <Inbox size={28} className="empty-icon" />
                  <p>{column.emptyText}</p>
                  <button
                    className="empty-add-btn"
                    onClick={() => onOpenCreateModal(column.id)}
                  >
                    <Plus size={13} />
                    <span>Create task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
