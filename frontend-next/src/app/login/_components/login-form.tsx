import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "../_validators/actionLogin";
import { SchemaLogin } from "../_schemas/schemaLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<SchemaLogin>({
    resolver: zodResolver(SchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const { errors, isSubmitting } = form.formState;
  const router = useRouter();

  async function onSubmit(data: SchemaLogin) {
    try {
      await loginUser(data);
      router.push("/home");
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível fazer login",
      });
    }
  }

  return (
    <form
      id="form-login"
      noValidate // Permite que o Zod faça as validações em vez do balão nativo do browser
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Mensagem de erro geral do backend (root) */}
        {errors.root && (
          <p className="text-sm font-medium text-red-500 text-center">
            {errors.root.message}
          </p>
        )}

        {/* Campo de Email */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email-input" className="font-rye">
            Email
          </FieldLabel>
          <Input
            id="email-input"
            type="email"
            placeholder="m@example.com"
            aria-invalid={!!errors.email}
            {...form.register("email")}
            className="bg-black/30 backdrop-blur-sm border rounded-sm p-6 shadow-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-stone-700"
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        {/* Campo de Senha */}
        <Field data-invalid={!!errors.password}>
          <div className="flex items-center">
            <FieldLabel htmlFor="password-input" className="font-rye">
              Password
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password-input"
            type="password"
            aria-invalid={!!errors.password}
            {...form.register("password")}
            className="bg-black/30 backdrop-blur-sm border rounded-sm p-6 shadow-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-stone-700"
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Carregando..." : "Login"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            {/* SVG do GitHub */}
            Login with GitHub
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}