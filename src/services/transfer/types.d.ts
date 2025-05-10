export interface TranferProps {
  amount: number;
  description?: string;
  recipientId: string;
}

export interface TranferResponse {
  id: string;
  amount: number;
  description?: string;
  createdAt: string;
  senderId: string;
  recipientId: string;
  reversed: boolean;
}

export type AccountType = 'SAVINGS' | 'CHECKING'; // Replace with actual enum values if available

export interface Reversal {
  id: string;
  reason: string;
  createdAt: Date;
}
