import { SchemaLogin } from "@/app/login/_schemas/schemaLogin";
import loginServices from "../_services/loginServices";


export async function loginUser(payload: SchemaLogin){
  
  console.log("loginUser payload:", payload);
  const parsed = SchemaLogin.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid payload");
  }
  await loginServices(parsed.data);
}