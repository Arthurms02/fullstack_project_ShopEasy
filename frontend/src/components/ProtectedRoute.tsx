import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '../hooks/useAuth'

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { authenticated } = useAuth()

  if (!authenticated) {
    return <Navigate to="/login" />
  }

  return children
}