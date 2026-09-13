import { ShoppingBag, UserRound, LogOut } from "lucide-react";

export default function HeaderHome() {
  const user = null; // Replace with actual user state
  const count = 0;

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <a href="#top" className="font-serif text-2xl tracking-tight">
        atelier<span className="text-primary">.</span>
      </a>
      <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
        <a href="#colecao" className="hover:text-foreground">
          Coleção
        </a>
        <a href="#manifesto" className="hover:text-foreground">
          Manifesto
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <button
          // onClick={() => (user ? switchUser(null) : setAuthOpen(true))}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-secondary"
        >
          {user ? (
            <>
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </>
          ) : (
            <>
              <UserRound size={16} />
              <span className="hidden sm:inline">Entrar</span>
            </>
          )}
        </button>
        <button
          aria-label="Abrir carrinho"
          // onClick={() => setCartOpen(true)}
          className="relative rounded-full bg-primary p-3 text-primary-foreground transition hover:scale-105"
        >
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
