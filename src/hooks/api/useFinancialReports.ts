import { useQuery } from '@tanstack/react-query';
import { apiClient } from "@/lib/api-client";

// Types untuk Financial Reports
export interface AccountBalance {
  account_id: string;
  account_code: string;
  account_name: string;
  account_type: 'ASSETS' | 'LIABILITIES' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  debit_balance: number;
  credit_balance: number;
  running_balance: number;
}

export interface BalanceSheetData {
  assets: {
    current_assets: AccountBalance[];
    fixed_assets: AccountBalance[];
    total_assets: number;
  };
  liabilities: {
    current_liabilities: AccountBalance[];
    long_term_liabilities: AccountBalance[];
    total_liabilities: number;
  };
  equity: {
    accounts: AccountBalance[];
    total_equity: number;
  };
  total_liabilities_equity: number;
}

export interface ProfitLossData {
  revenue: {
    accounts: AccountBalance[];
    total_revenue: number;
  };
  expenses: {
    accounts: AccountBalance[];
    total_expenses: number;
  };
  net_profit: number;
}

export interface CashFlowData {
  operating_activities: AccountBalance[];
  investing_activities: AccountBalance[];
  financing_activities: AccountBalance[];
  net_cash_flow: number;
}

export interface GeneralJournalEntry {
  id: string;
  reference_number: string;
  transaction_date: string;
  description: string;
  total_amount: number;
  category_id: string;
  notes: string | null;
  is_active: boolean;
  source_type: string;
  source_id: string;
  entries: {
    id: string;
    account_id: string;
    entry_type: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    account: {
      id: string;
      code: string;
      name: string;
      type: string;
    };
  }[];
  category: {
    id: string;
    name: string;
    description: string;
  };
  summary: {
    total_debit: number;
    total_credit: number;
    balance: number;
  };
}

export interface GeneralJournalResponse {
  transactions: GeneralJournalEntry[];
  summary: {
    total_debit: number;
    total_credit: number;
    balance: number;
    transaction_count: number;
  };
}

// Parameters untuk Financial Reports
export interface GetBalanceSheetParams {
  asOfDate: string;
}

export interface GetProfitLossParams {
  startDate: string;
  endDate: string;
}

export interface GetCashFlowParams {
  startDate: string;
  endDate: string;
}

export interface GetGeneralJournalParams {
  startDate: string;
  endDate: string;
  limit?: number;
  q?: string;
}

export interface GetGeneralLedgerParams {
  startDate: string;
  endDate: string;
}

export interface GeneralLedgerEntry {
  account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  initial_balance: number;
  total_debit: number;
  total_credit: number;
  final_balance: number;
}

// React Query Hooks
export const useGetBalanceSheet = (params: GetBalanceSheetParams, options = {}) => {
  const getBalanceSheet = async () => {
    const { data } = await apiClient.get('/realization/reports/balance-sheet', {
      params: { as_of_date: params.asOfDate }
    });
    return data.data;
  };

  return useQuery({
    queryKey: ['balance-sheet', params],
    queryFn: getBalanceSheet,
    enabled: !!params.asOfDate,
    ...options,
  });
};

export const useGetProfitLoss = (params: GetProfitLossParams, options = {}) => {
  const getProfitLoss = async () => {
    const { data } = await apiClient.get('/realization/reports/profit-loss', {
      params: { start_date: params.startDate, end_date: params.endDate }
    });
    return data.data;
  };

  return useQuery({
    queryKey: ['profit-loss', params],
    queryFn: getProfitLoss,
    enabled: !!params.startDate && !!params.endDate,
    ...options,
  });
};

export const useGetCashFlow = (params: GetCashFlowParams, options = {}) => {
  const getCashFlow = async () => {
    const { data } = await apiClient.get('/realization/reports/cash-flow', {
      params: { start_date: params.startDate, end_date: params.endDate }
    });
    return data.data;
  };

  return useQuery({
    queryKey: ['cash-flow', params],
    queryFn: getCashFlow,
    enabled: !!params.startDate && !!params.endDate,
    ...options,
  });
};

export const useGetGeneralJournal = (params: GetGeneralJournalParams, options = {}) => {
  const getGeneralJournal = async () => {
    const { data } = await apiClient.get('/realization/reports/general-journal', {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        limit: params.limit,
        q: params.q
      }
    });
    return data.data;
  };

  return useQuery({
    queryKey: ['general-journal', params],
    queryFn: getGeneralJournal,
    enabled: !!params.startDate && !!params.endDate,
    ...options,
  });
};

export const useGetGeneralLedger = (params: GetGeneralLedgerParams, options = {}) => {
  const getGeneralLedger = async () => {
    const { data } = await apiClient.get('/realization/reports/general-ledger', {
      params: { start_date: params.startDate, end_date: params.endDate }
    });
    return data.data;
  };

  return useQuery({
    queryKey: ['general-ledger', params],
    queryFn: getGeneralLedger,
    enabled: !!params.startDate && !!params.endDate,
    ...options,
  });
};
