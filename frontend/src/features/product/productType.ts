export type Product = {
  id: number;
  name: string;
  description: string;
  price: string; // o backend serializa Decimal como string — componentes usam parseFloat
  stock: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
}
