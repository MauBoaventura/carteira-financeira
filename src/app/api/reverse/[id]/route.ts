import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const deposit = await prisma.deposit.findUnique({
      where: { id },
    });

    if (deposit) {
      const user = await prisma.user.findUnique({
        where: { id: deposit.userId },
      });

      if (!user || user.balance < deposit.amount) {
        return NextResponse.json(
          { error: "Saldo insuficiente para reverter o depósito" },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: deposit.userId },
        data: { balance: { decrement: deposit.amount } },
      });

      await prisma.deposit.update({
        where: { id },
        data: { reversed: true },
      });

      return NextResponse.json({ message: "Depósito revertido com sucesso" });
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id },
    });

    if (transfer) {
      const sender = await prisma.user.findUnique({
        where: { id: transfer.senderId },
      });

      if (!sender || sender.balance + transfer.amount < 0) {
        return NextResponse.json(
          { error: "Saldo insuficiente para reverter a transferência" },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: transfer.senderId },
        data: { balance: { increment: transfer.amount } },
      });

      await prisma.user.update({
        where: { id: transfer.recipientId },
        data: { balance: { decrement: transfer.amount } },
      });

      await prisma.transfer.update({
        where: { id },
        data: { reversed: true },
      });

      return NextResponse.json({ message: "Transferência revertida com sucesso" });
    }

    return NextResponse.json(
      { error: "Operação não encontrada" },
      { status: 404 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
