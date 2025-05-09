import {CheckEmailMessage} from "@/containers/auth/check-email-message/check-email-message";
import {Metadata} from "next";


export const metadata:Metadata = {
    title: "Verifique seu e-mail",
    description: "Verifique seu e-mail FoxGreen - CRM",
}

export default function CheckEmailPage() {
    return (
        <CheckEmailMessage />
    );
}
