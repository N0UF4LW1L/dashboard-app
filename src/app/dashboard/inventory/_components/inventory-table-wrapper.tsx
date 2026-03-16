'use client';

import React, { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { Plus, Package, CheckCircle, Clock, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

import { useGetInventories } from '@/hooks/api/use-inventory';
import { useCreateInventory, useUpdateInventory, useDeleteInventory } from '@/hooks/api/use-inventory-mutations';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

import { InventoryTable } from './inventory-table';
import { CreateInventoryDialog } from './create-inventory-dialog';
import { InventoryEditDialog } from './inventory-edit-dialog';
import { InventoryViewDialog } from './inventory-view-dialog';

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
];

export default function InventoryTableWrapper() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce] = useDebounce(searchQuery, 500);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination states
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);

  // Queries & Mutations
  const { data: rawInventoryData, isLoading } = useGetInventories(
    searchDebounce || undefined,
    startDate || undefined,
    endDate || undefined
  );
  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory(editingItem?.id || '');
  const updateStatusMutation = useUpdateInventory(''); // need dynamic ID
  const deleteMutation = useDeleteInventory();
  const queryClient = useQueryClient();

  const inventoryData = rawInventoryData || [];

  // Client-side computations
  // 1. Filter by Status (since backend doesn't support it directly)
  const filteredData = useMemo(() => {
    let data = inventoryData;
    if (selectedStatus !== 'all') {
      data = data.filter(item => item.status === selectedStatus);
    }
    return data;
  }, [inventoryData, selectedStatus]);

  // 2. Pagination
  const paginatedData = useMemo(() => {
    const start = (pageNo - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageNo, pageSize]);

  const totalItems = filteredData.length;
  const pageCount = Math.ceil(totalItems / pageSize);

  // 3. Status
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let verified = 0;
    let totalValue = 0;

    inventoryData.forEach(item => {
      total++;
      if (item.status === 'pending') pending++;
      if (item.status === 'verified') verified++;
      totalValue += (item.quantity * item.unitPrice);
    });

    return { total, pending, verified, totalValue };
  }, [inventoryData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNo(1);
  };

  // mutation handlers
  const handleCreate = async (payload: any) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success('Inventaris berhasil ditambahkan');
      setShowCreateDialog(false);
    } catch (error) {
      toast.error('Gagal menambahkan inventaris');
    }
  };

  const handleUpdate = async (payload: any) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync(payload);
      toast.success('Inventaris berhasil diupdate');
      setEditingItem(null);
    } catch (error) {
      toast.error('Gagal mengupdate inventaris');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'verified') => {
    try {
      // Re-use update inventory mutation hook logic manually since the hook relies on ID passed at hook initialization, 
      // but wait, we can just call the mutation. Actually, let's use the hook like the reference did or initialize it manually.
      // Easiest is to initialize the hook properly, but since the hook is bound to ID in `useUpdateInventory(id)`, 
      // I will just use `updateMutation` but wait, `updateMutation` uses `editingItem?.id`. 
      // Let's create a generic mutate function or just update the backend manually.
      // Because `updateStatusMutation` has no ID... In `use-inventory-mutations.ts`, `useUpdateInventory` takes an id.
      // So I'll just change the data locally or re-init the query? It's better to modify `useUpdateInventory` to accept ID in mutate.
      // Wait, let's just use `fetch` or `apiClient` directly for this one-off status if needed, 
      // or modify `use-inventory-mutations.ts`. Actually, let's look at `use-inventory-mutations` again.
    } catch (error) {
      console.error(error);
    }
  };

  // Because the original hook takes `id` in hook init, we will use it
  const handleEditItemSubmit = (payload: any) => {
    handleUpdate(payload);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center justify-between gap-4 flex-wrap w-full lg:w-auto!">
          {/* Status Select */}
          <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPageNo(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search and Date Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama aset..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPageNo(1); }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Input 
                type="date"
                className="w-auto"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input 
                type="date" 
                className="w-auto"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Inventaris
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventaris</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total item inventaris
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu verifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              Sudah diverifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total nilai inventaris
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <InventoryTable
            data={paginatedData}
            pageSize={pageSize}
            pageNo={pageNo}
            pageCount={pageCount}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onUpdateStatus={async (id, newStatus) => {
              try {
                await apiClient.patch(`/inventories/${id}`, { status: newStatus });
                toast.success('Status berhasil diupdate');
                queryClient.invalidateQueries({ queryKey: ['inventories'] });
              } catch (err) {
                toast.error('Gagal update status');
              }
            }}
            onDelete={async (id) => {
              if (window.confirm('Yakin ingin menghapus item ini?')) {
                try {
                  await deleteMutation.mutateAsync(id);
                  toast.success('Item berhasil dihapus');
                } catch (err) {
                  toast.error('Gagal menghapus item');
                }
              }
            }}
            onEdit={setEditingItem}
            onViewDetail={setViewingItem}
          />
        )}
      </div>

      <CreateInventoryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {editingItem && (
        <InventoryEditDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onSubmit={handleEditItemSubmit}
          isSubmitting={updateMutation.isPending}
        />
      )}

      {viewingItem && (
        <InventoryViewDialog
          open={!!viewingItem}
          onOpenChange={(open) => !open && setViewingItem(null)}
          item={viewingItem}
        />
      )}
    </>
  );
}
