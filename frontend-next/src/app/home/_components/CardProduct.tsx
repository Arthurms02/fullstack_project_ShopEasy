import { getProducts } from "../_services/productAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductItem } from "../_components/ProductItem";




export default async function CardProduct() {
  const products = await getProducts();
  const session = await getServerSession(authOptions);
  const currentUserId = Number(session?.user?.id);

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
          <ProductItem
            key={product.id}
            product={product}
            isOwner={currentUserId === product.created_by}
            token={session?.accessToken || ""}
          />
        ))}
      </div>
    </section>
  );
}