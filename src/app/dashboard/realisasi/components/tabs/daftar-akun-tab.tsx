"use client";

import * as XLSX from 'xlsx';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Cloud, Search, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import AccountList from "../account-list";
import AccountModal from "../modals/account-modal";
import { useAccountForm } from "../../hooks/use-account-form";
import { Account, CreateAccountData, ReorderAccountsData } from "../../types";
import { toast } from "sonner";
import { AccountListSkeleton, FadeInWrapper, LoadingSpinner } from "../ui/skeleton-loading";
import Swal from "sweetalert2";
import "../ui/sweetalert-fix.css";
import {
  useGetHierarchicalAccounts,
  useGetAccountById,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useReorderAccounts,
  useGetAccounts
} from "@/hooks/api/useRealization";
import { TabType } from "../../hooks/use-tab-state";
import { useDebounce } from "../../hooks/use-debounce";

interface DaftarAkunTabProps {
  registerRefetchCallback: (tab: TabType, callback: () => void) => void;
}

export default function DaftarAkunTab({ registerRefetchCallback }: DaftarAkunTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  // API Hooks — use tree endpoint so children are nested correctly
  const { data: treeData, isLoading: accountsLoading, refetch: refetchAccounts } = useGetHierarchicalAccounts();

  // Also fetch flat list (for modal header-account selector)
  const { data: flatAccountsData } = useGetAccounts({ page: 1, limit: 200 });
  const { data: accountByIdData, isLoading: accountByIdLoading, refetch: refetchAccountById } = useGetAccountById(selectedAccountId || "");
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();
  const reorderAccountsMutation = useReorderAccounts();
  
  const {
    formData,
    isEditMode,
    editingAccountId,
    updateFormData,
    resetForm,
    setEditMode,
    getFormDataForAPI
  } = useAccountForm();

  // Register refetch callback for this tab
  useEffect(() => {
    registerRefetchCallback("daftar-akun", refetchAccounts);
  }, [registerRefetchCallback, refetchAccounts]);

  useEffect(() => {
    refetchAccounts();
  }, [refetchAccounts]);

  // Recursively add expanded=false to every node in the tree
  const organizeAccountsHierarchy = (accounts: Account[]) => {
    const addExpanded = (account: any): any => ({
      ...account,
      expanded: false,
      children: (account.children ?? []).map(addExpanded),
    });
    return (accounts ?? []).map(addExpanded);
  };

  // Client-side filter on tree (searches name or code recursively)
  const filterTree = (nodes: any[], q: string): any[] => {
    if (!q) return nodes;
    const lq = q.toLowerCase();
    return nodes.reduce<any[]>((acc, node) => {
      const filteredChildren = filterTree(node.children ?? [], lq);
      const matches =
        node.name.toLowerCase().includes(lq) ||
        node.code.toLowerCase().includes(lq);
      if (matches || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren, expanded: filteredChildren.length > 0 });
      }
      return acc;
    }, []);
  };

  const handleAddAccount = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditAccount = (id: string) => {
    setSelectedAccountId(id);
  };

  // Effect to handle account data when it's loaded
  useEffect(() => {
    if (accountByIdData && selectedAccountId) {
      const account = accountByIdData.data;
      
      if (account) {
        setEditMode(selectedAccountId as string, {
          code: account.code,
          name: account.name,
          type: account.type,
          level: account.level,
          is_header: account.is_header,
          sort_order: account.sort_order,
          parent_id: account.parent_id,
          initial_balance: account.initial_balance,
          description: account.description || ""
        });
        setIsModalOpen(true);
        setSelectedAccountId(null); // Reset after opening modal
      }
    }
  }, [accountByIdData, selectedAccountId, setEditMode]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Handler functions
  const handleReorderAccounts = async (newOrder: ReorderAccountsData) => {
    try {
      await reorderAccountsMutation.mutateAsync(newOrder);
      toast.success("Urutan akun berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui urutan akun");
      console.error("Error reordering accounts:", error);
    }
  };

  const handleExportAccounts = () => {
    try {
      if (!treeData || treeData.length === 0) {
        toast.error("Tidak ada data akun untuk diekspor");
        return;
      }

      // Flatten tree data specifically for export
      const flattenDataForExport = (accounts: any[], result: any[] = []) => {
        accounts.forEach(account => {
          result.push({
            'Kode Akun': account.code,
            'Nama Akun': account.name,
            'Tipe': account.type,
            'Kategori': account.is_header ? 'Header' : 'Sub-Akun',
            'Level': account.level,
            'Saldo Awal': account.initial_balance || 0,
            'Penanda': account.is_default ? 'Default' : '-',
            'Deskripsi': account.description || '-'
          });
          if (account.children && account.children.length > 0) {
            flattenDataForExport(account.children, result);
          }
        });
        return result;
      };

      const dataToExport = flattenDataForExport(treeData);

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Akun");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Format date for filename: YYYY-MM-DD
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `rekap_akun_${dateStr}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Berhasil mengunduh rekap akun");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengunduh rekap akun");
    }
  };

  const handleCreateAccount = async (accountData: CreateAccountData) => {
    try {
      await createAccountMutation.mutateAsync(accountData);
      await Swal.fire({
        title: "Berhasil",
        text: "Akun berhasil ditambahkan!",
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true,
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonColor: "#3085d6"
      });
      handleCloseModal();
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Gagal membuat akun",
        icon: "error",
        confirmButtonText: "OK",
        focusConfirm: true,
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonColor: "#d33"
      });
      console.error("Error creating account:", error);
    }
  };

  const handleUpdateAccount = async (id: string, accountData: CreateAccountData) => {
    try {
      await updateAccountMutation.mutateAsync({ id, body: accountData });
      await Swal.fire({
        title: "Berhasil",
        text: "Akun berhasil diperbarui!",
        icon: "success",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true,
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonColor: "#3085d6"
      });
      handleCloseModal();
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Gagal memperbarui akun",
        icon: "error",
        confirmButtonText: "OK",
        focusConfirm: true,
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonColor: "#d33"
      });
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus akun ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await deleteAccountMutation.mutateAsync(id);
        await Swal.fire({
          title: "Berhasil",
          text: "Akun berhasil dihapus!",
          icon: "success",
          confirmButtonText: "OK"
        });
        refetchAccounts();
      } catch (error) {
        await Swal.fire({
          title: "Error",
          text: "Gagal menghapus akun",
          icon: "error",
          confirmButtonText: "OK"
        });
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleSaveAccount = () => {
    const accountData = getFormDataForAPI();
    
    if (isEditMode && editingAccountId) {
      handleUpdateAccount(editingAccountId as string, accountData);
    } else {
      handleCreateAccount(accountData);
    }
    
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari akun....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2" onClick={handleExportAccounts}>
            <Cloud className="h-4 w-4" />
            <span>Rekap Akun</span>
          </Button>
          <Button 
            className={cn(buttonVariants({ variant: "default" }))}
            onClick={handleAddAccount}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Akun
          </Button>
        </div>
      </div>

        <Card>
          <CardContent className="p-6">
            {accountsLoading ? (
              <FadeInWrapper>
                <AccountListSkeleton />
              </FadeInWrapper>
            ) : (
              <FadeInWrapper delay={200}>
                <AccountList
                  accounts={filterTree(
                    organizeAccountsHierarchy(treeData || []),
                    debouncedSearchQuery
                  )}
                  onReorder={handleReorderAccounts}
                  onEditAccount={handleEditAccount}
                  onDeleteAccount={handleDeleteAccount}
                />
              </FadeInWrapper>
            )}
          </CardContent>
        </Card>

      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAccount}
        isEditMode={isEditMode}
        formData={formData}
        onFormChange={updateFormData}
        headerAccounts={flatAccountsData?.items?.filter((account: Account) => account.is_header) || []}
      />
    </div>
  );
}
