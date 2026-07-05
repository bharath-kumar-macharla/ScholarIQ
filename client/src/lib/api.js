import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // If using cookies, or just for cross-origin consistency
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            
            // Update the authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(originalRequest); // Retry original request
          }
        }
      } catch (refreshError) {
        // Refresh token failed, clear storage and let the app handle unauthenticated state
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-error'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
