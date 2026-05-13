import type { User } from '../auth/authType';

export type Product = {
  id: number | null;
  name: string;
  description: string;
  price: string;
  stock: number;
  image_url?: string | null;
  condition?: string;
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
  [k: string]: any
};

export type ProductCardProps = {
  product: Product;
}

export type ProductFavorite = {
  user: User;
  product: Product;
}

export type FavoritesState = {
  items: number[];
  loading: boolean;
}