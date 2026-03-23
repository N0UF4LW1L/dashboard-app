// ===== ACCOUNT TYPES =====
export enum AccountType {
  ASSETS = 'ASSETS',
  LIABILITIES = 'LIABILITIES',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export interface Account {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  is_active: boolean;
  sort_order: number;
  is_header: boolean;
  is_connected_to_bank: boolean;
  bank_name?: string | null;
  bank_account_number?: string | null;
  initial_balance: number;
  parent_id?: string | null;
  description?: string | null;
  parent?: Account | null;
  children?: Account[];
}

// ===== TRANSACTION CATEGORY TYPES =====
export interface TransactionCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  debit_account_id: string;
  credit_account_id: string;
  description?: string;
  is_active: boolean;
  debit_account?: Account;
  credit_account?: Account;
}

// ===== FINANCIAL TRANSACTION TYPES =====
export type EntryType = 'DEBIT' | 'CREDIT';
export type SourceType = 'order' | 'reimburse' | 'inventory' | 'manual';

export interface TransactionEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  transaction_id: string;
  account_id: string;
  entry_type: EntryType;
  amount: number;
  description?: string;
  account?: Account;
}

export interface FinancialTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  reference_number: string;
  transaction_date: string;
  description: string;
  total_amount: number;
  category_id?: string;
  notes?: string;
  is_active: boolean;
  source_type?: SourceType;
  source_id?: string;
  entries: TransactionEntry[];
  category?: TransactionCategory;
}

// ===== FORM TYPES =====
export interface CreateAccountData {
  code: string;
  name: string;
  type: AccountType;
  level?: number;
  is_header?: boolean;
  sort_order?: number;
  parent_id?: string;
  is_connected_to_bank?: boolean;
  bank_name?: string;
  bank_account_number?: string;
  initial_balance?: number;
  description?: string;
}

export interface CreateTransactionCategoryData {
  name: string;
  debit_account_id: string;
  credit_account_id: string;
  description?: string;
}

export interface CreateTransactionEntryData {
  account_id: string;
  entry_type: EntryType;
  amount: number;
  description?: string;
}

export interface CreateFinancialTransactionData {
  reference_number?: string;
  transaction_date: string;
  description: string;
  total_amount: number;
  category_id?: string;
  notes?: string;
  entries: CreateTransactionEntryData[];
  source_type?: SourceType;
  source_id?: string;
}

export interface ReorderAccountItem {
  id: string;
  sort_order: number;
}

export interface ReorderAccountsData {
  accounts: ReorderAccountItem[];
}

// ===== API RESPONSE TYPES =====
export interface PaginationMeta {
  total_items: number;
  item_count: number;
  items_per_page: number;
  total_pages: number;
  current_page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}