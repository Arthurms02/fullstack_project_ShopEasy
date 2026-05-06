import { Suspense, lazy, type JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import Loading from "../components/Loading";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const HomePage = lazy(() => import("../pages/HomePage"));
const SellerPage = lazy(() => import("../features/product/SellProduct"));
const CartPage = lazy(() => import("../features/cart/Cart"));
const ProductPage = lazy(() => import("../pages/ProductPage"));

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-4 font-bold text-gray-200">404</p>
        <h2 className="text-gray-700 mb-2">Página não encontrada</h2>
        <a href="/" className="text-orange-500 hover:underline text-sm">
          Voltar ao início
        </a>
      </div>
    </div>
  );
}



export function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } />
                <Route path="/vender" element={
                    <PrivateRoute>
                        <SellerPage />
                    </PrivateRoute>
                } />
                <Route path="/carrinho" element={
                    <PrivateRoute>
                        <CartPage />
                    </PrivateRoute>
                } />
                <Route path="/produtos" element={
                    <PrivateRoute>
                        <ProductPage />
                    </PrivateRoute>
                } />
            </Routes>
        </Suspense>
    );
}