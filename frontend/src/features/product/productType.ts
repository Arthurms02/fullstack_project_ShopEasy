import type { User } from '../auth/authType';

export type Product = {
  id: number | null;
  name: string;
  description: string;
  price: string; // o backend serializa Decimal como string — componentes usam parseFloat
  stock: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  isFavorite?: boolean; // campo extra para controle local de favoritos
}

export type ProductState = {
  products: Product[];
  isLoading: boolean;
  isFavorite: boolean;
  error: string | null;
}

export type ListParams = {
  search?: string;
  showDeleted?: boolean;
  [k: string]: any };

export type ProductCardProps = {
  product: Product;
}

export type ProductFavorite = {
  user: User;
  product: Product;
}