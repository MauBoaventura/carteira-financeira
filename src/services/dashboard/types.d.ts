export interface RecentTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Receita' | 'Despesa';
}

export interface DashboardResponse {
  balance: number;
  monthlyIncome: number;
  lastMonthExpense: number;
  recentTransactions: RecentTransaction[];
}