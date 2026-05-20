import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/routes";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "./app/store";
import { loginFailure, loginSuccess } from "./features/auth/authSlice";
import api from "./services/api";
import Loading from "./components/Loading";
import { fetchFavorites } from "./features/product/productAPI";
import { setFavoritesList } from "./features/product/favoriteSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "./features/cart/cartAPI"
import { setCart } from "./features/cart/cartSlice"

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Busca a sessão do usuário
  const { isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/users/me/");
        dispatch(loginSuccess(res.data)); // Sincroniza com seu Redux
        return res.data;
      } catch (err) {
        dispatch(loginFailure("Usuário não autenticado"));
        throw err; // O React Query entende que falhou
      }
    },
    retry: false, // Não tenta novamente se falhar (usuário deslogado)
    refetchOnWindowFocus: false, // Evita requisições toda vez que trocar de aba
  });

  // Busca os favoritos APENAS se a sessão estiver ok
  useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const favoriteIds = await fetchFavorites();
      dispatch(setFavoritesList(favoriteIds));
      return favoriteIds;
    },
    // O 'enabled' é a mágica: só roda essa query se NÃO estiver carregando a sessão
    // e se o usuário estiver autenticado
    enabled: !isLoadingSession,
    retry: false,
  });

  // Busca os cartItens
  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const cart = await fetchCart();
      dispatch(setCart(cart));
      return cart;
    },
    enabled: !isLoadingSession,
    staleTime: 1000 * 60,
    retry:false,
  })

  // Mostra o loading controlado pelo React Query
  if (isLoadingSession) {
    return <Loading text="Carregando sessão..." />;
  }

  if (isAuthenticated === null || isLoading) {
    return <Loading text="Carregando sessão..." />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App
