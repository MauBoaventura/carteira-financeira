export interface UserProps {
  id: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  balance: number;
  createdAt: Date;
}