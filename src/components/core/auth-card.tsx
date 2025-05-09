import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const AuthCard = ({ children, className }: Props) => (
  <div
    className={cn(
      "bg-card flex w-full max-w-[440px] flex-col items-center justify-center gap-6 rounded-2xl border border-slate-200 p-8",
      className
    )}
  >
    {children}
  </div>
);
