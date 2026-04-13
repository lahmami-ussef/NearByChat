import axios from 'axios';

const BASE_URL = 'http://192.168.1.3:3000'; // ← change to your backend URL

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ─── Auth ────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// ─── Zones ───────────────────────────────────────────────────────
export const getAllZones = () => api.get('/zone/all');
export const resolveZone = (coords) => api.post('/zone/resolve', coords);

// ─── Messages ────────────────────────────────────────────────────
export const getMessages = (zoneId) => api.get(`/messages/${zoneId}`);

// ─── User ─────────────────────────────────────────────────────────
export const getMyProfile = () => api.get('/user/me');

export default api;
