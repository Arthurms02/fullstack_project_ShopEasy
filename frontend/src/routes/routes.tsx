import { Suspense, lazy, type JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../app/store";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const HomePage = lazy(() => import("../pages/HomePage"));

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return <div>Verificando sessão...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}

export function AppRoutes() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <HomePage />
                    </PrivateRoute>
                } />
            </Routes>
        </Suspense>
    );
}