
export interface DepositProps {
  amount: number;
  bank: string;
  accountType: AccountType;
  reference?: string;
}

export interface DepositResponse {
  id: string
  amount: number
  bank: string
  accountType: AccountType
  reference: string
  createdAt: string
  userId: string
  reversed: boolean
}


export type AccountType = 'SAVINGS' | 'CHECKING'; // Replace with actual enum values if available

export interface Reversal {
  id: string;
  reason: string;
  createdAt: Date;
}
