import { z } from 'zod';

export const depositSchema = z.object({
  amount: z
    .number()
    .positive("O valor deve ser positivo")
    .max(100000, "O valor não pode exceder R$100.000"),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(200, "A descrição não pode exceder 200 caracteres"),
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Data inválida",
    }),
});

export type DepositFormData = z.infer<typeof depositSchema>;