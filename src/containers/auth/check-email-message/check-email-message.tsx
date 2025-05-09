import { AuthCard } from "@/components/core/auth-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CheckEmailMessage = () => {

  return (
    <AuthCard>
      <div className="flex w-full flex-col items-start justify-start gap-2">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Verifique o seu e-mail
        </h2>

        <p className="text-muted-foreground text-sm">Você receberá instruções para criar uma nova senha.</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Link href={"/auth/login"}>
          <Button variant="default" className={"w-full"}>
            Voltar ao login
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
};
