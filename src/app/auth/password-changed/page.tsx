import { PasswordChangedMessage } from "@/containers/auth/password-changed-message/password-changed-message";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senha alterada com sucesso",
  description: "Senha alterada com sucesso! FoxGreen - CRM",
};

export default function NewPasswordPage() {
  return <PasswordChangedMessage />;
}
