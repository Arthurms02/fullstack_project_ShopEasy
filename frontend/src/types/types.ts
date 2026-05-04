import type { Product } from "../features/product/productType";

export type HeaderProps = {
    onSearch: (query: string) => void;
    isVendedor?: boolean;
    user?: {
        name: string;
        email: string;
        avatar: string;
    } | null;
};

export type ProductCardProps = {
  product: Product;
}
