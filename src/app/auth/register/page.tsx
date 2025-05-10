import { RegisterForm } from "@/containers/auth/register-form/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Login to Carteira VirtuALL",
};

export default function LoginPage() {
  return <RegisterForm />;
}
