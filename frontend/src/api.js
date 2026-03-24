import axios from 'axios';
import { auth } from './firebaseConfig';

// VITE_API_URL is set in environment:
//   - Dev: empty (uses Vite proxy to localhost:8000)
//   - Production: set to your Render backend URL, e.g. https://civicease-api.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const requestConfig = { ...config };
  const isV1Request = requestConfig.url?.startsWith('/v1');
  if (!isV1Request) return requestConfig;

  const currentUser = auth.currentUser;
  if (!currentUser) return requestConfig;

  const token = await currentUser.getIdToken();
  requestConfig.headers = {
    ...requestConfig.headers,
    Authorization: `Bearer ${token}`,
  };
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && auth.currentUser) {
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error('Sign out failed after 401', signOutError);
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // In production, prepend the API URL; in dev, Vite proxy handles it
  return `${BASE_URL}${path}`;
};

export default api;
