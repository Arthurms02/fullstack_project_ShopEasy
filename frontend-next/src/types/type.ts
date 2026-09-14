export type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image_url: string | null;
  condition: string;
  created_by: number;
};