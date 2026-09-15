import { ProdutoFormData } from "@/app/home/_schemas/productSchema";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | 0 ;
  stock: number;
  image_url: string | null;
  created_by: number;
};



 export interface ProductFormProps {
  produtoInicial?: Product;
}
