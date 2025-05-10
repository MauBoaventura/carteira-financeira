import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyToken } from "@/lib/actions/auth";

const depositSchema = z.object({
  amount: z
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Digite um valor numérico",
    })
    .min(10, "Valor mínimo é R$ 10,00")
    .max(10000, "Valor máximo é R$ 10.000,00"),
  bank: z.string().min(1, "Selecione um banco"),
  accountType: z.enum(["CHECKING", "SAVINGS"], {
    required_error: "Selecione o tipo de conta",
  }),
  reference: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyToken(token); // Função para verificar e extrair o ID do usuário do token

    if (!userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = depositSchema.parse(body);

    if (parsedBody.amount <= 0) {
      return NextResponse.json({ error: "O valor não pode ser negativo ou zero" }, { status: 400 });
    }

    const deposit = await prisma.deposit.create({
      data: {
      amount: parsedBody.amount,
      bank: parsedBody.bank,
      accountType: parsedBody.accountType,
      reference: parsedBody.reference,
      userId,
      },
    });

    return NextResponse.json(deposit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}