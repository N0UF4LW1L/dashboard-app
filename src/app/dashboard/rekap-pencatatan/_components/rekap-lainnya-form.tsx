'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetTransactionCategories } from '@/hooks/api/useRealization';

interface RekapLainnyaFormData {
  name: string;
  category: string;
  categoryName: string; // To keep category label context optionally
  rawCategory?: any; // To hold full category object
  nominal: number | '';
  date: string;
  description: string;
}

interface RekapLainnyaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

export function RekapLainnyaForm({ open, onOpenChange, onSubmit, initialData, isSubmitting = false }: RekapLainnyaFormProps) {
  const [formData, setFormData] = useState<RekapLainnyaFormData>({
    name: '',
    category: '',
    categoryName: '',
    nominal: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetTransactionCategories({ 
    page: 1, limit: 1000, is_active: true 
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        categoryName: initialData.categoryName || '',
        nominal: initialData.nominal || '',
        date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
    } else if (open && !initialData) {
      setFormData({
        name: '',
        category: '',
        categoryName: '',
        nominal: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category.trim() || !formData.date || formData.nominal === '') {
      toast.error('Mohon lengkapi semua field yang wajib disi');
      return;
    }

    const payload = {
        name: formData.name.trim(),
        category: formData.category, // id string of category
        categoryName: formData.categoryName, // the name 
        rawCategory: formData.rawCategory,
        nominal: Number(formData.nominal),
        date: formData.date,
        description: formData.description.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Pencatatan Lainnya' : 'Tambah Pencatatan Lainnya'}</DialogTitle>
          <DialogDescription>
            Isi informasi detail pencatatan lain-lain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Transaksi *</Label>
            <Input
              id="name"
              placeholder="Contoh: Beli ATK"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori Realisasi *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => {
                const selectedCat = categoriesData?.items?.find((c: any) => c.id === value);
                setFormData({ 
                  ...formData, 
                  category: value, 
                  categoryName: selectedCat?.name || value,
                  rawCategory: selectedCat
                });
              }}
              disabled={isSubmitting || isCategoriesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isCategoriesLoading ? "Memuat kategori..." : "Pilih Kategori"} />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.items?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nominal">Nominal (IDR) *</Label>
            <Input
              id="nominal"
              type="number"
              min="0"
              placeholder="100000"
              value={formData.nominal}
              onChange={(e) => setFormData({ ...formData, nominal: e.target.value ? Number(e.target.value) : '' })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Transaksi *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Keterangan (Opsional)</Label>
            <Input
              id="description"
              placeholder="Tambahkan catatan"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
            />
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
