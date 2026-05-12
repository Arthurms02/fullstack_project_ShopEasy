import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "./app/store";
import { loginFailure, loginSuccess } from "./features/auth/authSlice";
import { useEffect } from "react";
import api from "./app/api";


const queryClient = new QueryClient();

function AppContent() {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    if (isAuthenticated === null || isLoading) {
    return <div>Carregando sessão...</div>;
  }

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}


function App() {

  const dispatch = useDispatch();

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Tente acessar uma rota protegida
                const res = await api.get('/api/v1/users/me/'); // Exemplo de rota protegida
                dispatch(loginSuccess(res.data));
            } catch (err) {
                // O interceptor já vai tentar o refresh antes de chegar aqui
                dispatch(loginFailure("Usuário não autenticado"));
            }
        };
        checkSession();
    }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
