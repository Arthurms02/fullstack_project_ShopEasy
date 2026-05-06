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
  isLoading: boolean;
  error: string | null;
}

export type ListParams = {
  search?: string;
  showDeleted?: boolean;
  [k: string]: any };

export type ProductCardProps = {
  product: Product;
}