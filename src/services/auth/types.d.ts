export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginProps {
  password: string;
  email: string;
}

export interface RegisterProps {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  error?: string;
}
