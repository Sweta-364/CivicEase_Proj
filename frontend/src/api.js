import axios from 'axios';

// VITE_API_URL is set in environment:
//   - Dev: empty (uses Vite proxy to localhost:8000)
//   - Production: set to your Render backend URL, e.g. https://civicease-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // In production, prepend the API URL; in dev, Vite proxy handles it
  return `${BASE_URL}${path}`;
};

export default api;
