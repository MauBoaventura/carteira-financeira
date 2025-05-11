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
import { LoginPayload } from "@/lib/types";
import { AuthService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .nonempty("A senha é obrigatória"),
});

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const response = await AuthService.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        router.push('/dashboard');
      } else {
        toast.error('Erro', {
          description: response.data.error || 'Usuário ou senha inválidos',
        });
      }
    } catch (err) {
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
        <h2 className="text-3xl font-semibold">Entrar</h2>
        <p className="text-muted-foreground text-sm">
          Digite seu e-mail abaixo para fazer login em sua conta
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex size-full flex-col gap-4"
        >
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

          <div className="flex size-full flex-col gap-2">
            {/* Botão de Login */}
            <Button
              variant="default"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Entrando..." : "Login"}
            </Button>

            {/* Link para recuperação de senha */}
            <Link href="/auth/forgot-password">
              <Button variant="ghost" className="w-full">
                Esqueceu sua senha?
              </Button>
            </Link>

            {/* Botão de Registro */}
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Criar uma conta
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
