export type LoginPayload = {
    id: number;
    nome_completo: string;
    email: string;
    role: string;
}

export type User = {
    id: number;
    nome_completo: string;
    email: string;
    role: string;
};

export type AuthState = {
    isAuthenticated: boolean | null;
    role: string | null;
    nome_completo: string | null;
    email: string | null;
    isLoading: boolean;
    error: string | null;
}
