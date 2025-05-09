import { AuthCard } from "@/components/core/auth-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const PasswordChangedMessage = () => {

  return (
    <AuthCard className="gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <Image
          src="/assets/check-circle.svg"
          width={48}
          height={48}
          alt="check-green"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0">
          Senha alterada com sucesso
        </h2>

        <p className="text-muted-foreground text-sm">Entre em sua conta novamente</p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Link href={"/auth/login"}>
          <Button variant="default" className={"w-full"}>
            Login
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
};
