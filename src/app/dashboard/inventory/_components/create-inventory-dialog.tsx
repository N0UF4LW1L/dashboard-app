'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateInventoryData {
  assetName: string;
  quantity: number;
  unitPrice: number;
  purchaseDate: string;
  status: 'pending' | 'verified';
}

interface CreateInventoryFormData {
  assetName: string;
  quantity: number | '';
  unitPrice: number | '';
  purchaseDate: string;
  status: 'pending' | 'verified';
}

interface CreateInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateInventoryData) => void;
  isSubmitting?: boolean;
}

export function CreateInventoryDialog({ open, onOpenChange, onSubmit, isSubmitting = false }: CreateInventoryDialogProps) {
  const [formData, setFormData] = useState<CreateInventoryFormData>({
    assetName: '',
    quantity: 1,
    unitPrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'pending',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetName.trim()) {
      newErrors.assetName = 'Nama aset harus diisi';
    }

    if (formData.quantity === '' || formData.quantity <= 0) {
      newErrors.quantity = 'Jumlah harus lebih dari 0';
    }

    if (formData.unitPrice === '' || formData.unitPrice < 0) {
      newErrors.unitPrice = 'Harga satuan tidak boleh negatif';
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

    // Prepare data for API call
    const apiData: CreateInventoryData = {
      assetName: formData.assetName.trim(),
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      purchaseDate: formData.purchaseDate,
      status: formData.status,
    };

    onSubmit(apiData);
    
    // Reset form states so next time opened it is clean
    if (!isSubmitting) {
      setFormData({
        assetName: '',
        quantity: 1,
        unitPrice: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof CreateInventoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
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
    // Allow empty string for better UX
    if (value === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setFormData(prev => ({ ...prev, [field]: numValue }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const quantity = Number(formData.quantity || 0);
  const unitPrice = Number(formData.unitPrice || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Inventaris Baru</DialogTitle>
          <DialogDescription>
            Isi informasi detail inventaris yang akan ditambahkan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assetName">Nama Aset *</Label>
            <Input
              id="assetName"
              placeholder="Contoh: Laptop Dev Team"
              value={formData.assetName}
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
                value={formData.quantity}
                onChange={(e) => handleNumberInputChange('quantity', e.target.value)}
                className={errors.quantity ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Harga Satuan (IDR) *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                placeholder="0"
                value={formData.unitPrice}
                onChange={(e) => handleNumberInputChange('unitPrice', e.target.value)}
                className={errors.unitPrice ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-500">{errors.unitPrice}</p>
              )}
            </div>
          </div>

          {quantity > 0 && unitPrice > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Harga:</div>
              <div className="text-lg font-semibold">
                {formatCurrency(quantity * unitPrice)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Tanggal Pembelian *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
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
                value={formData.status}
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

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Inventaris'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
