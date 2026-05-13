import api from "../../app/api";

export const loginRequest = async (email: string, password: string) => {
    try {
        const response = await api.post('/api/token/', { email, password });
        return response;
    } catch (error) {
        // Precisamos LANÇAR o erro para o LoginForm conseguir capturar
        throw error;
    }
};

export const RegisterRequest = async (nome_completo: string, email: string, password: string, role: string) => {
    try {
        const response = await api.post('/api/v1/register/', { nome_completo, email, password, role });
        return response.data;
    } catch (error) {
        // Lança o erro para o RegisterForm capturar e mostrar na tela
        throw error;
    }
};

export const logoutRequest = async () => {
    try {
        const response = await api.post('/api/v1/logout/logout/');
        return response.data;
    } catch (error) {
        throw error;
    }
};