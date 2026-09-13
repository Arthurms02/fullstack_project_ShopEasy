import {z} from "zod";

export const SchemaLogin = z.object({
  email: z.email({ message: "Email inválido" }).max(150, { message: "Email muito longo" }),
  password: z.string().trim().min(6, { message: "Senha precisa ter pelo menos 6 caracteres"}),
});

export type SchemaLogin = z.infer<typeof SchemaLogin>;