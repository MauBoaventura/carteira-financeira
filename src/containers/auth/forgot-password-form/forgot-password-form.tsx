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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
});

type ForgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const { push } = useRouter();
  const form = useForm<ForgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordProps) => {
    push("/auth/check-email");
  };

  return (
    <AuthCard>
      <div className="flex flex-col items-start justify-start gap-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Esqueceu a senha?
        </h2>

        <p className="text-muted-foreground text-sm">Entre com o seu e-mail para receber instruções de recuperação da sua conta.</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex size-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder={authConstants.passwordPlaceholder}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-2">
            <Button variant="default" className={"w-full"} type="submit">
              Enviar link
            </Button>
            <Link href="/auth/login">
              <Button variant="ghost" className={"w-full"}>
                Voltar ao login
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
