export interface PasswordRequirements {
  minLength: boolean;
  upperCase: boolean;
  lowerCase: boolean;
  numbers: boolean;
  specialChars: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}
