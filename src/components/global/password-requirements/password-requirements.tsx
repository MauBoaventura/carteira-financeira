"use client";
import { PasswordRequirements as IPasswordRequirements } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface Props {
  requirements: IPasswordRequirements;
}

const RequirementIcon = ({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) => {
  const Icon = useMemo(() => (valid ? `✔` : `𐄂`), [valid]);
  return (
    <li
      className={cn(
        "flex flex-row items-center gap-1",
        valid ? "text-green-500" : "text-slate-600"
      )}
    >
      {Icon}
      <span className="text-xs font-medium">{label}</span>
    </li>
  );
};

export const PasswordRequirements = ({ requirements }: Props) => {
  return (
    <div>
      <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold">Sua senha deve conter:</p>
        <ul className="grid gap-2">
          <RequirementIcon
            valid={requirements.minLength}
            label={'Mais de 8 caracteres'}
          />
          <RequirementIcon
            valid={requirements.upperCase}
            label={'Letras maiúsculas (A-Z)'}
          />
          <RequirementIcon
            valid={requirements.lowerCase}
            label={'Letras minúsculas (a-z)'}
          />
          <RequirementIcon
            valid={requirements.numbers}
            label={'Números (0-9)'}
          />
          <RequirementIcon
            valid={requirements.specialChars}
            label={'Caracteres especiais'}
          />
        </ul>
      </div>
    </div>
  );
};
