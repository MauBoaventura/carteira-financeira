"use server";
import { LoginPayload } from "@/lib/types";
import { checkLoginPayload } from "@/lib/utils";
import { cookies } from "next/headers";
import { authConstants } from "@/lib/constants";

export async function setUserCookie(data: LoginPayload) {
  const isAuthorized = checkLoginPayload(data);
  if (isAuthorized) {
    const oneDay = 24 * 60 * 60 * 1000;
    (await cookies()).set(
      authConstants.userPrefix,
      JSON.stringify(authConstants.user),
      {
        expires: Date.now() + oneDay,
      }
    );
  }
  return isAuthorized;
}

export async function removeUserCookie() {
  return (await cookies()).delete(authConstants.userPrefix);
}
