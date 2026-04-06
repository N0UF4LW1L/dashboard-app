'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface Planning {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  total_amount?: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanningEntry {
  id: string;
  planning_id: string;
  date: string;
  account_debit_id: string;
  account_credit_id: string;
  amount: number;
  note?: string;
  created_at: string;
}

export interface PlanningAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
  is_active: boolean;
  is_header: boolean;
  sort_order: number;
  initial_balance: number;
  parent_id?: string;
  parent?: PlanningAccount;
  children: PlanningAccount[];
}

// ─── PLANNING HOOKS ───────────────────────────────────────────────────────────

export const useGetPlannings = (params?: { page?: number; limit?: number; q?: string }) => {
  return useQuery({
    queryKey: ['plannings', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/planning', { params });
      return data;
    },
  });
};

export const useGetDetailPlanning = (id: string) => {
  return useQuery({
    queryKey: ['planning', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreatePlanning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; start_date?: string; end_date?: string }) => {
      const { data } = await apiClient.post('/planning', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
    },
  });
};

export const useUpdatePlanning = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Planning>) => {
      const { data } = await apiClient.put(`/planning/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
      queryClient.invalidateQueries({ queryKey: ['planning', id] });
    },
  });
};

export const useDeletePlanning = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete(`/planning/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannings'] });
    },
  });
};

// ─── ACCOUNTS (READ-ONLY dari Realisasi) ──────────────────────────────────────

export const useGetPlanningAccounts = (params?: { search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['planning-accounts', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/planning/accounts/list', { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── ENTRIES HOOKS ────────────────────────────────────────────────────────────

export const useGetPlanningEntries = (
  planningId: string,
  params?: { page?: number; limit?: number; q?: string; date_from?: string; date_to?: string },
) => {
  return useQuery({
    queryKey: ['planning-entries', planningId, params],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${planningId}/entries`, { params });
      return data;
    },
    enabled: !!planningId,
  });
};

export const useCreatePlanningEntry = (planningId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      date: string;
      account_debit_id: string;
      account_credit_id: string;
      amount: number;
      note?: string;
    }) => {
      const { data } = await apiClient.post(`/planning/${planningId}/entries`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-entries', planningId] });
    },
  });
};

export const useUpdatePlanningEntry = (planningId: string, entryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<PlanningEntry>) => {
      const { data } = await apiClient.put(`/planning/${planningId}/entries/${entryId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-entries', planningId] });
    },
  });
};

export const useDeletePlanningEntry = (planningId: string, entryId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete(`/planning/${planningId}/entries/${entryId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning-entries', planningId] });
    },
  });
};

// ─── LAPORAN HOOKS ────────────────────────────────────────────────────────────

export const useGetPlanningProfitLoss = (
  planningId: string,
  params?: { startDate?: string; endDate?: string },
) => {
  return useQuery({
    queryKey: ['planning-laba-rugi', planningId, params],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${planningId}/laporan/laba-rugi`, { params });
      return data;
    },
    enabled: !!planningId,
  });
};

export const useGetPlanningBalanceSheet = (
  planningId: string,
  params?: { asOfDate?: string },
) => {
  return useQuery({
    queryKey: ['planning-neraca', planningId, params],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${planningId}/laporan/neraca`, { params });
      return data;
    },
    enabled: !!planningId,
  });
};

export const useGetPlanningCashFlow = (
  planningId: string,
  params?: { startDate?: string; endDate?: string },
) => {
  return useQuery({
    queryKey: ['planning-arus-kas', planningId, params],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${planningId}/laporan/arus-kas`, { params });
      return data;
    },
    enabled: !!planningId,
  });
};

export const useGetPlanningJournal = (
  planningId: string,
  params?: { page?: number; limit?: number; date_from?: string; date_to?: string },
) => {
  return useQuery({
    queryKey: ['planning-jurnal', planningId, params],
    queryFn: async () => {
      const { data } = await apiClient.get(`/planning/${planningId}/laporan/jurnal-umum`, { params });
      return data;
    },
    enabled: !!planningId,
  });
};
