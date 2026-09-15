import {z} from "zod";


// 1. Definindo o Schema de Validação com Zod
export const produtoSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  // z.coerce transforma a string do input type="number" em um número para o Zod validar
  price: z.coerce.number().positive("O preço deve ser maior que zero"), 
  description: z.string().min(10, "A descrição precisa de pelo menos 10 caracteres"),
  stock: z.coerce.number().int().nonnegative("O estoque não pode ser negativo"),
  image_url: z.string().url("A URL da imagem deve ser válida").nullable(),
});


export type ProdutoFormInput = z.input<typeof produtoSchema>;
export type ProdutoFormData = z.output<typeof produtoSchema>;
