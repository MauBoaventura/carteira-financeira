"use client";
import { AuthCard } from "@/components/core/auth-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authConstants } from "@/lib/constants";
import { RegisterPayload } from "@/lib/types";
import { AuthService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .max(50, "O nome deve ter no máximo 50 caracteres"),
    email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .nonempty("A senha é obrigatória"),
    passwordConfirmation: z
      .string()
      .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres")
      .nonempty("A confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });


export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      const response = await AuthService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })
      if (!response.status.toString().startsWith("2")) {
        const error = await response.data
        toast.error("Erro ao registrar usuário", {
          description: error.error || "Tente novamente mais tarde",
        });
        return;
      }

      toast.success("Usuário registrado com sucesso", {
        description: "Você pode fazer login agora",
      });

      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      let errorMessage = "Ocorreu um erro inesperado";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Erro inesperado", {
        description: errorMessage,
      });
    }
  };


  return (
    <AuthCard>
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <h2 className="text-3xl font-semibold">Registrar</h2>
        <p className="text-muted-foreground text-sm">
          Preencha os campos abaixo para criar sua conta
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex size-full flex-col gap-4"
        >
          {/* Campo de Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu nome"
                    {...field}
                    type="text"
                    autoComplete="name"
                    required
                  />
                </FormControl>
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          {/* Campo de E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={authConstants.emailExample}
                    {...field}
                    type="email"
                    autoComplete="email"
                    required
                  />
                </FormControl>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Campo de Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder={authConstants.passwordPlaceholder}
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </FormControl>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          {/* Campo de Confirmação de Senha */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmação de Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder={authConstants.passwordPlaceholder}
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </FormControl>
                {form.formState.errors.passwordConfirmation && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.passwordConfirmation.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <div className="flex size-full flex-col gap-2">
            {/* Botão de Register */}
            <Button
              variant="default"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Registrando..." : "Registrar"}
            </Button>

            {/* Link para voltar à tela de login */}
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full">
                Já tem uma conta? Faça login
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
