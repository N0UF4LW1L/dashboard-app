'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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

interface InventoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
  isSubmitting?: boolean;
}

export function InventoryEditDialog({ open, onOpenChange, item, onSubmit, isSubmitting = false }: InventoryEditDialogProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [errors, setErrors] = useState<Partial<InventoryItem>>({});

  useEffect(() => {
    if (item && open) {
      setFormData({
        assetName: item.assetName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        purchaseDate: item.purchaseDate.split('T')[0],
        status: item.status,
      });
      setErrors({});
    }
  }, [item, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<InventoryItem> = {};

    if (!formData.assetName?.trim()) {
      newErrors.assetName = 'Nama aset harus diisi';
    }

    if (formData.quantity !== undefined && formData.quantity <= 0) {
      (newErrors as any).quantity = 'Jumlah harus lebih dari 0';
    }

    if (formData.unitPrice !== undefined && formData.unitPrice < 0) {
      (newErrors as any).unitPrice = 'Harga satuan tidak boleh negatif';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Tanggal pembelian harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon periksa kembali form yang diisi');
      return;
    }

    let updatedData = { ...formData };
    
    // Call API submit
    onSubmit(updatedData);
  };

  const handleInputChange = (field: keyof InventoryItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle number input changes properly
  const handleNumberInputChange = (field: 'quantity' | 'unitPrice', value: string) => {
    if (value === '') {
      setFormData(prev => ({ ...prev, [field]: '' as any }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calculateTotalPrice = () => {
    const quantity = formData.quantity ?? item?.quantity ?? 0;
    const unitPrice = formData.unitPrice ?? item?.unitPrice ?? 0;
    return quantity * unitPrice;
  };

  if (!item) return null;
  const isPriceChanged = formData.quantity !== item.quantity || formData.unitPrice !== item.unitPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Inventaris</DialogTitle>
          <DialogDescription>
            Update informasi inventaris: <span className="font-semibold text-foreground">{item.assetName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetName">Nama Aset *</Label>
            <Input
              id="assetName"
              placeholder="Contoh: Laptop Dev"
              value={formData.assetName || ''}
              onChange={(e) => handleInputChange('assetName', e.target.value)}
              className={errors.assetName ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.assetName && (
              <p className="text-sm text-red-500">{errors.assetName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity || ''}
                onChange={(e) => handleNumberInputChange('quantity', e.target.value)}
                className={errors.quantity ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Harga Satuan (IDR) *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                placeholder="0"
                value={formData.unitPrice || ''}
                onChange={(e) => handleNumberInputChange('unitPrice', e.target.value)}
                className={errors.unitPrice ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-500">{errors.unitPrice as string}</p>
              )}
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Harga:</div>
            <div className="text-lg font-semibold">
              {formatCurrency(calculateTotalPrice())}
            </div>
            <div className={`text-xs mt-1 ${isPriceChanged ? 'text-primary' : 'text-muted-foreground'}`}>
              {isPriceChanged ? 'Harga akan diupdate otomatis' : 'Harga tidak berubah'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Tanggal Pembelian *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate || ''}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                className={errors.purchaseDate ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.purchaseDate && (
                <p className="text-sm text-red-500">{errors.purchaseDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || item.status}
                onValueChange={(value: 'pending' | 'verified') => handleInputChange('status', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Update Inventaris'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
