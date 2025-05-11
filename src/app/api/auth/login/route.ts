import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const { password: p, ...userWithoutPassword } = user; 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });

  const response = NextResponse.json(
    { token, user: userWithoutPassword },
    { status: 200 }
  );
  
  const oneDay = 24 * 60 * 60;
  response.cookies.set("user", JSON.stringify(user), { maxAge: oneDay });
  response.cookies.set("token", token, { maxAge: oneDay });
  return response;
}
