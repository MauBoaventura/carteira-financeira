import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/actions/auth";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const deposits = await prisma.deposit.findMany({
      where: { userId },
    });
    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
      },
    });

    const combinedData = [
      ...deposits.map(deposit => ({
        id: deposit.id,
        type: 'DEPOSIT',
        amount: deposit.amount,
        date: deposit.createdAt,
        counterparty: null,
        status: deposit.reversed ? 'REVERSED' : 'COMPLETED',
        reversible: !deposit.reversed,
      })),
      ...transfers.map(async transfer => {
        const counterpartyId = transfer.senderId === userId ? transfer.recipientId : transfer.senderId;
        const counterparty = await prisma.user.findUnique({ where: { id: counterpartyId } });
        return {
          id: transfer.id,
          type: 'TRANSFER',
          amount: transfer.amount,
          date: transfer.createdAt,
          counterparty,
          status: transfer.reversed ? 'REVERSED' : 'COMPLETED',
          reversible: !transfer.reversed,
        };
      }),
    ];

    const resolvedData = await Promise.all(combinedData);

    resolvedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(resolvedData, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar depósitos e transferências:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}