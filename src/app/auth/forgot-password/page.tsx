import { ForgotPasswordForm } from "@/containers/auth/forgot-password-form/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  description: "Esqueci minha senha FoxGreen - CRM",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
