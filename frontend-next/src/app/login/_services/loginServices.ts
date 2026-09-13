import { SchemaLogin } from "@/app/login/_schemas/schemaLogin";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
  
export default async function loginServices(payload: SchemaLogin) {

  console.log("loginServices payload:", payload);

  const result = await signIn("credentials", {
    email: payload.email,
    password: payload.password,
    redirect: false,
  });
  
  if (!result?.ok) {
    throw new Error("Invalid credentials");
  }
}