import Image from "next/image";
import { Plus } from "lucide-react";
import { money } from "@/lib/utils";
import { getProducts } from "../_services/productAction";


export default async function CardProduct() {
  const products = await getProducts();

  return (
    <section id="colecao" className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Seleção atual
            </p>
            <h2 className="mt-2 font-serif text-4xl">Peças essenciais</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {products.length} itens
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <article key={product.id} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-secondary">
                <Image
                  width={100}
                  height={100}
                  src={product.image_url || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <button
                  // onClick={() => add(product.id)}
                  aria-label={`Adicionar ${product.name}`}
                  className="absolute bottom-3 right-3 rounded-full bg-background p-3 opacity-0 shadow-sm transition group-hover:opacity-100"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex items-start justify-between pt-4">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sem categoria
                  </p>
                </div>
                <span className="text-sm">product.price</span>
              </div>
            </article>
          ))}
        </div>
      </section>
  );
}