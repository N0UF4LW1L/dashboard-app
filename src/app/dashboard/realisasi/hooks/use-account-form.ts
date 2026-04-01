"use client";

import { useState } from "react";
import { CreateAccountData, AccountType } from "../types";

export interface AccountFormData {
  code: string;
  name: string;
  type: AccountType;
  level: number;
  is_header: boolean;
  sort_order: number;
  parent_id?: string;
  initial_balance: number;
  description?: string;
}

const initialFormData: AccountFormData = {
  code: "",
  name: "",
  type: AccountType.ASSETS,
  level: 2,
  is_header: false,
  sort_order: 0,
  parent_id: undefined,
  initial_balance: 0,
  description: ""
};

export function useAccountForm() {
  const [formData, setFormData] = useState<AccountFormData>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  const updateFormData = (updates: Partial<AccountFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditMode(false);
    setEditingAccountId(null);
  };

  const setEditMode = (accountId: string, accountData: Partial<AccountFormData>) => {
    setIsEditMode(true);
    setEditingAccountId(accountId);
    setFormData(prev => ({ ...prev, ...accountData }));
  };

  const getFormDataForAPI = (): CreateAccountData => {
    return {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      level: formData.level,
      is_header: formData.is_header,
      sort_order: formData.sort_order,
      parent_id: formData.parent_id,
      initial_balance: formData.initial_balance,
      description: formData.description || undefined,
    };
  };

  return {
    formData,
    isEditMode,
    editingAccountId,
    updateFormData,
    resetForm,
    setEditMode,
    getFormDataForAPI
  };
}
