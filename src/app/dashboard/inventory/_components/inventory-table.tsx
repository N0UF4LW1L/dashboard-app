'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface InventoryItem {
  id: string;
  assetName: string;
  quantity: number;
  unitPrice: number;
  purchaseDate: string;
  status: 'pending' | 'verified';
  createdAt: string;
  updatedAt: string;
}

interface InventoryTableProps {
  data: InventoryItem[];
  pageNo: number;
  totalItems: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
  
  onSelectionChange?: (selectedIds: string[]) => void;
  onUpdateStatus: (id: string, status: 'pending' | 'verified') => void;
  onDelete: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onViewDetail: (item: InventoryItem) => void;
}

export function InventoryTable({ 
  data, 
  pageNo,
  totalItems,
  pageCount,
  onPageChange,
  onPageSizeChange,
  pageSize,
  onSelectionChange, 
  onUpdateStatus, 
  onDelete,
  onEdit,
  onViewDetail
}: InventoryTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const pageSizeOptions = [10, 20, 30, 40, 50];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(item => item.id);
      setSelectedRows(allIds);
      if (onSelectionChange) onSelectionChange(allIds);
    } else {
      setSelectedRows([]);
      if (onSelectionChange) onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedRows, id];
    } else {
      newSelection = selectedRows.filter(rowId => rowId !== id);
    }
    setSelectedRows(newSelection);
    if (onSelectionChange) onSelectionChange(newSelection);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'pending' | 'verified') => {
    if (status === 'verified') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    );
  };

  return (
    <div className="w-full space-y-4">
      <ScrollArea className="h-[calc(80vh-220px)] w-full rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Nama Aset</TableHead>
                <TableHead className="text-center">Jumlah</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead>Tanggal Pembelian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map(item => {
                  const totalPrice = item.quantity * item.unitPrice;
                  return (
                    <TableRow key={item.id} data-state={selectedRows.includes(item.id) && "selected"}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                          aria-label={`Select row ${item.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.assetName}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(totalPrice)}</TableCell>
                      <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDetail(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {item.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => onUpdateStatus(item.id, 'verified')}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Verified
                              </DropdownMenuItem>
                            )}
                            {item.status === 'verified' && (
                              <DropdownMenuItem 
                                onClick={() => onUpdateStatus(item.id, 'pending')}
                                className="text-yellow-600"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                Mark as Pending
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => onDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      
      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows.length} dari {totalItems} baris dipilih.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Baris per halaman</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Halaman {pageNo} dari {pageCount || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={pageNo === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(pageNo - 1)}
              disabled={pageNo === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(pageNo + 1)}
              disabled={pageNo === pageCount || pageCount === 0}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(pageCount)}
              disabled={pageNo === pageCount || pageCount === 0}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
