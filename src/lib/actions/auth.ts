"use server";
import { LoginPayload } from "@/lib/types";
import { cookies } from "next/headers";
import { authConstants } from "@/lib/constants";
import { User } from "@/services/auth/types";
import jwt from "jsonwebtoken";

export async function setUserCookie(data: User) {
  const oneDay = 24 * 60 * 60 * 1000;
  (await cookies()).set("user", JSON.stringify(data), {
    expires: Date.now() + oneDay,
  });
}

export async function setTokenCookie(data: string) {
  const oneDay = 24 * 60 * 60 * 1000;
  (await cookies()).set("token", data, {
    expires: Date.now() + oneDay,
  });
}

export async function removeUserCookie() {
  return (await cookies()).delete(authConstants.userPrefix);
}
export async function removeTokenCookie() {
  return (await cookies()).delete(authConstants.userPrefix);
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return typeof decoded === "object" && "userId" in decoded ? decoded.userId : null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
