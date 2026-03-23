import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const baseEndpoint = "/realization";

// ===== ACCOUNTS HOOKS =====
interface GetAccountsParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  type?: string;
  level?: number;
  is_connected_to_bank?: boolean;
  is_header?: boolean;
  parent_id?: string;
  sort_by?: string;
  sort_dir?: 'ASC' | 'DESC';
}

// Helper to normalize backend response { success, data, meta } => { items, meta }
const normalizeListResponse = (response: any) => ({
  items: response?.data || [],
  meta: response?.meta || {},
});

export const useGetAccounts = (params: GetAccountsParams = {}, options = {}) => {
  const getAccounts = async () => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    const { data } = await apiClient.get(`${baseEndpoint}/accounts`, {
      params: cleanParams,
    });
    return normalizeListResponse(data);
  };

  return useQuery({
    queryKey: ["realization", "accounts", params],
    queryFn: getAccounts,
    ...options,
  });
};

export const useGetAccountsWithBalance = (params: GetAccountsParams = {}, options = {}) => {
  const getAccountsWithBalance = async () => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    const { data } = await apiClient.get(`${baseEndpoint}/accounts/with-balance`, {
      params: cleanParams,
    });
    return normalizeListResponse(data);
  };

  return useQuery({
    queryKey: ["realization", "accounts", "with-balance", params],
    queryFn: getAccountsWithBalance,
    ...options,
  });
};

export const useGetAccountById = (id: string) => {
  const getAccountById = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/accounts/${id}`);
    return data?.data || data;
  };

  return useQuery({
    queryKey: ["realization", "accounts", id],
    queryFn: getAccountById,
    enabled: !!id,
  });
};

export const useGetHierarchicalAccounts = (options = {}) => {
  const getHierarchicalAccounts = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/accounts/tree`);
    return data?.data || data;
  };

  return useQuery({
    queryKey: ["realization", "accounts", "hierarchical"],
    queryFn: getHierarchicalAccounts,
    ...options,
  });
};

export const useGetBankAccountsWithBalance = (params: GetAccountsParams = {}, options = {}) => {
  const getBankAccountsWithBalance = async () => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    const { data } = await apiClient.get(`${baseEndpoint}/accounts/with-balance`, {
      params: { ...cleanParams, is_connected_to_bank: true },
    });
    return normalizeListResponse(data);
  };

  return useQuery({
    queryKey: ["realization", "accounts", "bank", "with-balance", params],
    queryFn: getBankAccountsWithBalance,
    ...options,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const createAccount = async (body: any) => {
    const { data } = await apiClient.post(`${baseEndpoint}/accounts`, body);
    return data;
  };

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "accounts"] });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  const updateAccount = async ({ id, body }: { id: string; body: any }) => {
    const { data } = await apiClient.put(`${baseEndpoint}/accounts/${id}`, body);
    return data;
  };

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "accounts"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  const deleteAccount = async (id: string) => {
    const { data } = await apiClient.delete(`${baseEndpoint}/accounts/${id}`);
    return data;
  };

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "accounts"] });
    },
  });
};

export const useReorderAccounts = () => {
  const queryClient = useQueryClient();

  const reorderAccounts = async (body: any) => {
    const { data } = await apiClient.put(`${baseEndpoint}/accounts/reorder`, body);
    return data;
  };

  return useMutation({
    mutationFn: reorderAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "accounts"] });
    },
  });
};

// ===== TRANSACTION CATEGORIES HOOKS =====
interface GetTransactionCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  is_active?: boolean;
}

export const useGetTransactionCategories = (params: GetTransactionCategoriesParams = {}, options = {}) => {
  const getTransactionCategories = async () => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    const { data } = await apiClient.get(`${baseEndpoint}/transaction-categories`, {
      params: cleanParams,
    });
    return normalizeListResponse(data);
  };

  return useQuery({
    queryKey: ["realization", "categories", params],
    queryFn: getTransactionCategories,
    ...options,
  });
};

export const useGetTransactionCategoryById = (id: string) => {
  const getTransactionCategoryById = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/transaction-categories/${id}`);
    return data?.data || data;
  };

  return useQuery({
    queryKey: ["realization", "categories", id],
    queryFn: getTransactionCategoryById,
    enabled: !!id,
  });
};

export const useCreateTransactionCategory = () => {
  const queryClient = useQueryClient();

  const createTransactionCategory = async (body: any) => {
    const { data } = await apiClient.post(`${baseEndpoint}/transaction-categories`, body);
    return data;
  };

  return useMutation({
    mutationFn: createTransactionCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "categories"] });
    },
  });
};

export const useUpdateTransactionCategory = () => {
  const queryClient = useQueryClient();

  const updateTransactionCategory = async ({ id, body }: { id: string; body: any }) => {
    const { data } = await apiClient.put(`${baseEndpoint}/transaction-categories/${id}`, body);
    return data;
  };

  return useMutation({
    mutationFn: updateTransactionCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "categories"] });
    },
  });
};

export const useDeleteTransactionCategory = () => {
  const queryClient = useQueryClient();

  const deleteTransactionCategory = async (id: string) => {
    const { data } = await apiClient.delete(`${baseEndpoint}/transaction-categories/${id}`);
    return data;
  };

  return useMutation({
    mutationFn: deleteTransactionCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "categories"] });
    },
  });
};

// ===== FINANCIAL TRANSACTIONS HOOKS =====
interface GetFinancialTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  category_id?: string;
  account_id?: string;
  start_date?: string;
  end_date?: string;
  source_type?: string;
}

export const useGetFinancialTransactions = (params?: GetFinancialTransactionsParams) => {
  const getFinancialTransactions = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/financial-transactions`, {
      params,
    });
    return normalizeListResponse(data);
  };

  return useQuery({
    queryKey: ["realization", "transactions", params],
    queryFn: getFinancialTransactions,
  });
};

export const useGetFinancialTransactionById = (id: string) => {
  const getFinancialTransactionById = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/financial-transactions/${id}`);
    return data?.data || data;
  };

  return useQuery({
    queryKey: ["realization", "transactions", id],
    queryFn: getFinancialTransactionById,
    enabled: !!id,
  });
};

export const useCreateFinancialTransaction = () => {
  const queryClient = useQueryClient();

  const createFinancialTransaction = async (body: any) => {
    const { data } = await apiClient.post(`${baseEndpoint}/financial-transactions`, body);
    return data;
  };

  return useMutation({
    mutationFn: createFinancialTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "transactions"] });
    },
  });
};

export const useUpdateFinancialTransaction = () => {
  const queryClient = useQueryClient();

  const updateFinancialTransaction = async ({ id, body }: { id: string; body: any }) => {
    const { data } = await apiClient.put(`${baseEndpoint}/financial-transactions/${id}`, body);
    return data;
  };

  return useMutation({
    mutationFn: updateFinancialTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "transactions"] });
    },
  });
};

export const useDeleteFinancialTransaction = () => {
  const queryClient = useQueryClient();

  const deleteFinancialTransaction = async (id: string) => {
    const { data } = await apiClient.delete(`${baseEndpoint}/financial-transactions/${id}`);
    return data;
  };

  return useMutation({
    mutationFn: deleteFinancialTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization", "transactions"] });
    },
  });
};

// ===== FINANCIAL REPORTS HOOKS =====
export const useGetBalanceSheet = (asOfDate: string, options = {}) => {
  const getBalanceSheet = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/reports/balance-sheet`, {
      params: { as_of_date: asOfDate }
    });
    return data;
  };

  return useQuery({
    queryKey: ["realization", "reports", "balance-sheet", asOfDate],
    queryFn: getBalanceSheet,
    enabled: !!asOfDate,
    ...options,
  });
};

export const useGetProfitLoss = (startDate: string, endDate: string, options = {}) => {
  const getProfitLoss = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/reports/profit-loss`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return data;
  };

  return useQuery({
    queryKey: ["realization", "reports", "profit-loss", startDate, endDate],
    queryFn: getProfitLoss,
    enabled: !!startDate && !!endDate,
    ...options,
  });
};

export const useGetCashFlow = (startDate: string, endDate: string, options = {}) => {
  const getCashFlow = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/reports/cash-flow`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return data;
  };

  return useQuery({
    queryKey: ["realization", "reports", "cash-flow", startDate, endDate],
    queryFn: getCashFlow,
    enabled: !!startDate && !!endDate,
    ...options,
  });
};

export const useGetGeneralJournalReport = (startDate: string, endDate: string, limit?: number, options = {}) => {
  const getGeneralJournalReport = async () => {
    const { data } = await apiClient.get(`${baseEndpoint}/reports/general-journal`, {
      params: { start_date: startDate, end_date: endDate, limit }
    });
    return data;
  };

  return useQuery({
    queryKey: ["realization", "reports", "general-journal", startDate, endDate, limit],
    queryFn: getGeneralJournalReport,
    enabled: !!startDate && !!endDate,
    ...options,
  });
};

// ===== SYNC HOOKS =====
export const useSyncAllRealizations = () => {
  const queryClient = useQueryClient();

  const syncAllRealizations = async () => {
    const { data } = await apiClient.post(`${baseEndpoint}/sync/all`);
    return data;
  };

  return useMutation({
    mutationFn: syncAllRealizations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["realization"] });
    },
  });
};
