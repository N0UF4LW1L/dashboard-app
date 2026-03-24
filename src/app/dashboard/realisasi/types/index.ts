// ===== ACCOUNT TYPES =====
export type AccountType = 'ASSETS' | 'LIABILITIES' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  is_active: boolean;
  sort_order: number;
  is_header: boolean;
  is_connected_to_bank: boolean;
  is_default: boolean;
  bank_name?: string;
  bank_account_number?: string;
  initial_balance: number;
  parent_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  parent?: Account;
  children?: Account[];
}

export interface AccountItem {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  expanded: boolean;
  children: AccountItem[];
  is_header: boolean;
  is_connected_to_bank: boolean;
  bank_name?: string;
  bank_account_number?: string;
  initial_balance: number;
}

export interface AccountTableItem {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  status: 'active' | 'inactive';
  lastUpdated: string;
  bank_name?: string;
  bank_account_number?: string;
  is_connected_to_bank: boolean;
}

// ===== TRANSACTION CATEGORY TYPES =====
export interface TransactionCategory {
  id: string;
  name: string;
  debit_account_id: string;
  credit_account_id: string;
  description?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  debit_account: Account;
  credit_account: Account;
}

export interface CategoryItem {
  id: string;
  name: string;
  debit_account_id: string;
  credit_account_id: string;
  debit_account: Account;
  credit_account: Account;
  description?: string;
}

// ===== FINANCIAL TRANSACTION TYPES =====
export type EntryType = 'DEBIT' | 'CREDIT';
export type SourceType = 'order' | 'reimburse' | 'inventory' | 'manual';

export interface TransactionEntry {
  id: string;
  transaction_id: string;
  account_id: string;
  entry_type: EntryType;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  account: Account;
}

export interface FinancialTransaction {
  id: string;
  reference_number: string;
  transaction_date: string;
  description: string;
  total_amount: number;
  category_id?: string;
  notes?: string;
  is_active: boolean;
  source_type?: SourceType;
  source_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  category?: TransactionCategory;
  entries: TransactionEntry[];
}

export interface TransactionItem {
  id: string;
  reference_number: string;
  transaction_date: string;
  description: string;
  total_amount: number;
  category?: TransactionCategory;
  entries: TransactionEntry[];
  source_type?: SourceType;
  source_id?: string;
}

// ===== FINANCIAL REPORTS TYPES =====
export interface AccountBalance {
  account_id: string;
  account_code: string;
  account_name: string;
  account_type: AccountType;
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

export interface ReportItem {
  id: string;
  title: string;
  type: 'balance-sheet' | 'profit-loss' | 'cash-flow' | 'general-journal';
  status: 'published' | 'draft';
  created_by: string;
  created_at: string;
  updated_at: string;
  description?: string;
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
  reference_number: string;
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
  items: T[];
  meta: PaginationMeta;
}

// ===== TAB TYPES =====
export type TabType = "daftar-akun" | "daftar-rekening" | "transaksi" | "laporan" | "kategori";
