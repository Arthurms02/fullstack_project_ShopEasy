import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './authType'
import type { LoginPayload } from './authType'


const initialState: AuthState = {
    nome_completo: null,
    email: null,
    role: null,
    isAuthenticated: null,
    isLoading: true,
    error: null,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<LoginPayload>) => {

            state.isLoading = false;
            state.nome_completo = action.payload.nome_completo;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.nome_completo = null;
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;