
export interface DepositProps {
  amount: number;
  bank: string;
  accountType: AccountType;
  reference?: string;
}

export type AccountType = 'SAVINGS' | 'CHECKING'; // Replace with actual enum values if available

export interface Reversal {
  id: string;
  reason: string;
  createdAt: Date;
}

export interface DepositResponse {
  deposit: Deposit
  updatedBalance: number
}

export interface Deposit {
  id: string
  amount: number
  bank: string
  accountType: string
  reference: string
  createdAt: string
  userId: string
  reversed: boolean
}
