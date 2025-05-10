import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ajuste o path conforme seu projeto
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Usuário já existe' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  return NextResponse.json({ user }, { status: 201 });
}
