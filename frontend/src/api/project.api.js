import api from './axios';

export const listProjectsApi = () => api.get('/projects');
export const getProjectApi = (id) => api.get(`/projects/${id}`);
export const createProjectApi = (data) => api.post('/projects', data);
export const updateProjectApi = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProjectApi = (id) => api.delete(`/projects/${id}`);

export const listMembersApi = (projectId) => api.get(`/projects/${projectId}/members`);
export const inviteMemberApi = (projectId, data) => api.post(`/projects/${projectId}/members`, data);
export const removeMemberApi = (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`);
