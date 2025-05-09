import {NewPasswordForm} from "@/containers/auth/new-password-form/new-password-form";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Criar nova senha",
    description: "Crie uma nova senha para acessar o FoxGreen - CRM",
}

export default function NewPasswordPage() {
    return (
        <NewPasswordForm />
    );
}
