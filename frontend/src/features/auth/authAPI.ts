import api from "../../app/api";


export const loginRequest = async (email: string, password: string) => {
    try {
        const response = await api.post('/api/token/', { email, password });
        return response; // Retorna os dados do usuário
    } catch (error) {
        Error('Credenciais inválidas');
    }
};

export const RegisterRequest = async (nome_completo: string, email: string, password: string, role: string) => {
    try {
        const response = await api.post('/api/v1/register/', { nome_completo, email, password, role });
        return response.data; // Retorna os dados do usuário
    } catch (error) {
        Error('Erro ao registrar usuário');
    }
};

export const logoutRequest = async () => {
    try {
        const response = await api.post('/api/v1/logout/logout/');
        return response.data; // Retorna os dados do usuário
    }   catch (error) {
        Error('Erro ao fazer logout');
    }
};
