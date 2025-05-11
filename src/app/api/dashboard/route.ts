import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/actions";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const userId = await verifyToken(token);
  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
  if (type === "resume") {
    try {
      const saldo = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      const receitaMes = await prisma.deposit.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          reversed: false,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });

      const despesaUltimoMes = await prisma.transfer.aggregate({
        _sum: { amount: true },
        where: {
          senderId: userId,
          reversed: false,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
            lt: new Date(), // agora
          },
        },
      });

      return NextResponse.json({
        balance: saldo?.balance || 0,
        monthlyIncome: receitaMes._sum.amount || 0,
        lastMonthExpense: despesaUltimoMes._sum.amount || 0,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao buscar dados do banco" },
        { status: 500 }
      );
    }
  } else if (type === "recent-transactions") {
    try {
      const [transfers, deposits] = await Promise.all([
        prisma.transfer.findMany({
          where: {
            OR: [{ senderId: userId }, { recipientId: userId }],
          },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            description: true,
            amount: true,
            senderId: true,
            recipientId: true,
          },
        }),
        prisma.deposit.findMany({
          where: {
            userId,
            reversed: false,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            createdAt: true,
            amount: true,
            bank: true,
          },
        }),
      ]);

      const formattedTransfers = transfers.map((transaction) => ({
        id: transaction.id,
        date: transaction.createdAt.toISOString().split("T")[0],
        description: transaction.description || "",
        amount:
          transaction.senderId === userId
            ? -transaction.amount
            : transaction.amount,
        type: transaction.senderId === userId ? "Despesa" : "Receita",
      }));

      const formattedDeposits = deposits.map((deposit) => ({
        id: deposit.id,
        date: deposit.createdAt.toISOString().split("T")[0],
        description: `Depósito - ${deposit.bank}`,
        amount: deposit.amount,
        type: "Receita",
      }));

      const allTransactions = [...formattedTransfers, ...formattedDeposits]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      return NextResponse.json(allTransactions);
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao buscar transações recentes" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }
}
