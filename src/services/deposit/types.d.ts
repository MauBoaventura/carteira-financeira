
export interface DepositProps {
  amount: number;
  bank: string;
  accountType: AccountType;
  reference?: string;
}

export interface DepositResponse {
  deposit: DepositProps;
  user: User;
  reversal?: Reversal[];
}

export type AccountType = 'SAVINGS' | 'CHECKING'; // Replace with actual enum values if available

export interface Reversal {
  id: string;
  reason: string;
  createdAt: Date;
}
