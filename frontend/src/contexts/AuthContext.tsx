import {
  createContext,
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'

import api from '../lib/axios'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextData {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  authenticated: boolean
}

export const AuthContext = createContext({} as AuthContextData)

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userStorage = localStorage.getItem('user')

    if (userStorage) {
      setUser(JSON.parse(userStorage))
    }
  }, [])

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
    } catch (error) {
      console.error(error)
      alert('Erro ao fazer login')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}