import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LoginPayload, PasswordRequirements } from "../types";
import { authConstants } from "../constants";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkLoginPayload(payload: LoginPayload) {
  const emailIsValid = payload.email === authConstants.user.email;
  const passwordIsValid = payload.password === authConstants.user.password;
  const isValid = emailIsValid && passwordIsValid;
  return isValid;
}

export function validateUserCookie(cookie: RequestCookie | undefined) {
  if (!cookie?.value) {
    return false;
  }
  try {
    return true;
  } catch (error) {
    console.error("Failed to parse cookie value:", error);
    return false;
  }
}

export function validatePasswordRequirements(newPassword: string) {
  const requirements: PasswordRequirements = {
    minLength: newPassword.length >= 8,
    upperCase: /[A-Z]/.test(newPassword),
    lowerCase: /[a-z]/.test(newPassword),
    numbers: /[0-9]/.test(newPassword),
    specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };
  const isValid = Object.values(requirements).every(
    (requirement) => requirement
  );
  return { isValid, requirements };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}