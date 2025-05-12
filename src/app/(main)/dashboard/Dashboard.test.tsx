import { render, screen } from '@testing-library/react';
import Dashboard from './page';

jest.mock('@/services/dashboard', () => ({
  DashboardService: {
    dashboard: jest.fn().mockResolvedValue({
      data: {
        balance: 1000,
        monthlyIncome: 3000,
        lastMonthExpense: 1200,
      },
    }),
    getRecentTransactions: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          date: '2024-05-10',
          description: 'Salário',
          amount: 3000,
          type: 'Receita',
        },
        {
          id: '2',
          date: '2024-05-12',
          description: 'Supermercado',
          amount: -500,
          type: 'Despesa',
        },
      ],
    }),
  },
}));

jest.mock('@/store/useWalletStore', () => ({
  useBankStore: () => ({
    balance: 1000,
    loadBalance: jest.fn(),
  }),
}));

describe('Dashboard', () => {
  it('renderiza título Resumo Financeiro', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('Resumo Financeiro')).toBeInTheDocument();
  });
});
