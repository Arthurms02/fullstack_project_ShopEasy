import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { logout } = useAuth()

  return (
    <nav className="bg-zinc-900 text-white p-4 flex justify-between">
      <h1>ShopEasy</h1>

      <button onClick={logout}>
        Sair
      </button>
    </nav>
  )
}