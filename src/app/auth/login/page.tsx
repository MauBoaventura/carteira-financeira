import { LoginForm } from "@/containers/auth/login-form/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Carteira VirtuALL",
};

export default function LoginPage() {
  return <LoginForm />;
}
