import axios from 'axios';
// import { store } from './store';
// import { loginSuccess, logout } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Permite envio de cookies (para httpOnly cookies ou JWT)
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Apenas a chamada limpa, o cookie vai junto automaticamente
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
                    {}, // Corpo vazio!
                    { withCredentials: true } // OBRIGATÓRIO
                );

                // Se o refresh acima der 200 OK, o Django enviou um novo Cookie
                // Refazemos a requisição original e o Axios envia o novo Cookie
                return api(originalRequest);
            } catch (refreshError) {
                // ... lida com logout ...
            }
        }
        return Promise.reject(error);
    }
);

export default api;