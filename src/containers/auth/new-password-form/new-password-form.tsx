"use client";
import { AuthCard } from "@/components/core/auth-card";
import { PasswordRequirements } from "@/components/global/password-requirements/password-requirements";
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
import { validatePasswordRequirements } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newPasswordSchema = z.object({
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type NewPasswordProps = z.infer<typeof newPasswordSchema>;

export const NewPasswordForm = () => {
  const { push } = useRouter();
  const form = useForm<NewPasswordProps>({
    resolver: zodResolver(
      newPasswordSchema.superRefine((data, ctx) => {
        const { isValid } = validatePasswordRequirements(data.newPassword);
        const areEqual = data.newPassword === data.confirmPassword;
        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["newPassword", "confirmPassword"],
          });
        }
        if (!areEqual) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["confirmPassword"],
          });
        }
      })
    ),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("newPassword");
  const { requirements } = useMemo(
    () => validatePasswordRequirements(password),
    [password]
  );

  const onSubmit = (data: NewPasswordProps) => {
    push("/auth/password-changed");
  };

  return (
    <AuthCard>
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Criar nova senha
        </h2>

        <p className="text-muted-foreground text-sm">Crie uma nova senha para sua conta</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex size-full flex-col gap-4"
        >
          <div className="flex flex-col gap-6 self-stretch">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={authConstants.passwordPlaceholder}
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={authConstants.passwordPlaceholder}
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <PasswordRequirements requirements={requirements} />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button variant="default" className={"w-full"} type="submit">
              Alterar Senha
            </Button>
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};
