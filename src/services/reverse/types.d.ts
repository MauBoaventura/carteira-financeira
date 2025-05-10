import { User } from "@prisma/client";

export interface Reversal {
  id: string;
  reason: string;
  createdAt: Date;
}

export interface ReverseResponse {
  id: string;
  type: 'DEPOSIT' | 'TRANSFER';
  amount: number;
  date: string;
  counterparty: User;
  status: 'REVERSED' | 'COMPLETED';
  reversible: boolean;
}
