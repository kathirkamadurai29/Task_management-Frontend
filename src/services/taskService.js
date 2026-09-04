import { apiRequest } from './api';

export const taskService = {
  /**
   * Fetch all tasks for the logged in user
   */
  async getTasks() {
    const data = await apiRequest('/tasks/', { method: 'GET' });
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      // If single task returned or wrapped
      return [data];
    }
    return [];
  },

  /**
   * Get single task by ID
   */
  async getTask(id) {
    return await apiRequest(`/tasks/${id}`, { method: 'GET' });
  },

  /**
   * Create a new task
   */
  async createTask({ title, description, assigned_to }) {
    const payload = {
      title: title.trim(),
      description: description ? description.trim() : null,
      assigned_to: assigned_to ? parseInt(assigned_to, 10) : null,
    };

    return await apiRequest('/tasks/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update task (title, description, status, assigned_to)
   */
  async updateTask(id, updates) {
    const payload = {};
    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.description !== undefined) payload.description = updates.description ? updates.description.trim() : null;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.assigned_to !== undefined) {
      payload.assigned_to = updates.assigned_to ? parseInt(updates.assigned_to, 10) : null;
    }

    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete task by ID
   */
  async deleteTask(id) {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Fetch dashboard metrics (total_users, total_tasks, pending_tasks, in_progress_tasks, completed_tasks)
   */
  async getDashboard() {
    return await apiRequest('/dashboard/', { method: 'GET' });
  },

  /**
   * Health check
   */
  async getHealth() {
    return await apiRequest('/health', { method: 'GET' });
  },
};
