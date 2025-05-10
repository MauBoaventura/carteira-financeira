import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyToken } from "@/lib/actions/auth";

const transferSchema = z.object({
  amount: z
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Digite um valor numérico",
    })
    .min(1, "Valor mínimo é R$ 1,00")
    .max(5000, "Valor máximo é R$ 5.000,00"),
  recipientId: z.string().min(1, "Selecione um destinatário"),
  description: z.string().max(100, "Máximo de 100 caracteres").optional(),
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const senderId = await verifyToken(token);

    if (!senderId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();
    const parsedBody = transferSchema.parse(body);

    if (parsedBody.amount <= 0) {
      return NextResponse.json({ error: "O valor não pode ser negativo ou zero" }, { status: 400 });
    }

    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender || sender.balance < parsedBody.amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({
      where: { id: parsedBody.recipientId },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Destinatário não encontrado" }, { status: 404 });
    }

    const transfer = await prisma.transfer.create({
      data: {
        amount: parsedBody.amount,
        description: parsedBody.description,
        senderId,
        recipientId: parsedBody.recipientId,
      },
    });

    await prisma.user.update({
      where: { id: senderId },
      data: { balance: sender.balance - parsedBody.amount },
    });

    await prisma.user.update({
      where: { id: parsedBody.recipientId },
      data: { balance: recipient.balance + parsedBody.amount },
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}