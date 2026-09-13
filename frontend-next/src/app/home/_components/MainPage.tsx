import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function MainPage() {
  return (
    <section
        id="top"
        className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-10 lg:pt-20"
      >
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Objetos para viver melhor
          </p>
          <h1 className="max-w-2xl font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Menos coisas.
            <br />
            <em className="text-primary">Mais intenção.</em>
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
            Uma curadoria honesta de peças duráveis, feitas para acompanhar o
            seu ritmo e ficar por muito tempo.
          </p>
          <a
            href="#colecao"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:gap-5"
          >
            Ver coleção <ArrowRight size={16} />
          </a>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-secondary">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"
            alt="Interior minimalista da loja atelier"
            className="h-[420px] w-full object-cover mix-blend-multiply md:h-[520px]"
            width={1200}
            height={520}
          />
          <div className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs">
            Edição 01 — outono 2026
          </div>
        </div>
      </section>
  );
}