import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Home from '../pages/Home'
import Products from '../pages/Products'
import CreateProduct from '../pages/CreateProduct'
import EditProduct from '../pages/EditProduct'

import { ProtectedRoute } from '../components/ProtectedRoute'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}