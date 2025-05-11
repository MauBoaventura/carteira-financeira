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
  const userId = await verifyToken(token); // Função para verificar e extrair o ID do usuário do token
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
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
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
  } else {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }
}
