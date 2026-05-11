import { useEffect, useState } from 'react'

import { getProducts } from '../services/productService'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
    }

    loadProducts()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Produtos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-4">
              {product.name}
            </h2>

            <p>{product.description}</p>

            <strong>
              R$ {product.price}
            </strong>
          </div>
        ))}
      </div>
    </div>
  )
}