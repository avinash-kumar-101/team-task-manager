import api from './axios';

export const listTasksApi = (projectId, filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
  return api.get(`/projects/${projectId}/tasks?${params.toString()}`);
};

export const getTaskApi = (taskId) => api.get(`/tasks/${taskId}`);
export const createTaskApi = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTaskApi = (taskId, data) => api.put(`/tasks/${taskId}`, data);
export const updateTaskStatusApi = (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status });
export const deleteTaskApi = (taskId) => api.delete(`/tasks/${taskId}`);
