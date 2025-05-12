// src/store/useBankStore.ts
import { DashboardService } from '@/services/dashboard'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BankState {
  balance: number
  loadBalance: () => Promise<void>
  updateBalance: (amount: number) => void
}

export const useBankStore = create<BankState>()(
  persist(
    (set) => ({
      balance: 0,
      loadBalance: async () => {
        try {
          const response = await DashboardService.dashboard()
          set({ balance: response.data.balance })
        } catch (error) {
          console.error('Erro ao carregar o saldo', error)
        }
      },
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
    }),
    {
      name: 'bank-store', // armazenado no localStorage
    }
  )
)
