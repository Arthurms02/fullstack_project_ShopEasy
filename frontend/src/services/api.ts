import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // tenta trocar o refresh (o cookie de refresh deve ser enviado automaticamente)
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        // se deu certo, reenvia a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        // refresh falhou => token expirou definitivamente
        try {
          store.dispatch(logout());
        } catch (error)
        { console.error("Erro ao despachar logout:", error); }

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          // força reload para /login (reset do estado)
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;