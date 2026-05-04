import api from "../../app/api";


export const loginRequest = async (email: string, password: string) => {
    try {
        const response = await api.post('/api/token/', { email, password });
        return response.data; // Retorna os dados do usuário e token
    } catch (error) {
        throw new Error('Credenciais inválidas');
    }
};

export const RegisterRequest = async (nome_completo: string, email: string, password: string, role: string) => {
    try {
        const response = await api.post('/api/v1/register/', { nome_completo, email, password, role });
        return response.data; // Retorna os dados do usuário e token
    } catch (error) {
        throw new Error('Erro ao registrar usuário');
    }
};