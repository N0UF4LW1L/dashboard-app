'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Loader2 } from 'lucide-react';
import { useCreateAddon, useUpdateAddon } from '@/hooks/api/use-addon-mutations';

interface Addon {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
}

interface AddonFormProps {
    initialData: Addon | null;
}

export const AddonForm: React.FC<AddonFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Add-on' : 'Tambah Add-on';
    const description = isEdit ? 'Edit data add-on' : 'Tambah add-on baru';
    const action = isEdit ? 'Simpan Perubahan' : 'Tambah';

    const createMutation = useCreateAddon();
    const updateMutation = useUpdateAddon(initialData?.id ?? '');

    const [form, setForm] = useState({
        name: initialData?.name || '',
        category: initialData?.category || '',
        price: initialData?.price ? String(initialData.price) : '',
        stock: initialData?.stock ? String(initialData.stock) : '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama add-on wajib diisi';
        if (!form.category) errs.category = 'Kategori wajib dipilih';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
            errs.price = 'Harga persatuan tidak valid';
        if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
            errs.stock = 'Stok tidak valid';
        return errs;
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const payload = {
            name: form.name.trim(),
            category: form.category,
            price: Number(form.price),
            stock: Number(form.stock),
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload as any, {
            onSuccess: () => {
                router.push('/dashboard/addons');
            },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
            </div>
            <Separator />

            <form onSubmit={onSubmit} className="space-y-8 w-full">
                <div className="md:grid md:grid-cols-2 gap-8">
                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="add-name" className="relative">
                            Nama Add-on <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="add-name"
                            placeholder="Misal: Baby Seat, Tenda, dll"
                            value={form.name}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, name: e.target.value.trimStart() }));
                                setErrors((r) => ({ ...r, name: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.name && (
                            <p className="text-sm font-medium text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                        <Label htmlFor="add-cat" className="relative">
                            Kategori (Mobil/Motor) <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.category}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, category: v }));
                                setErrors((r) => ({ ...r, category: '' }));
                            }}
                            disabled={isPending}
                        >
                            <SelectTrigger id="add-cat">
                                <SelectValue placeholder="Pilih kategori peruntukkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mobil">Mobil</SelectItem>
                                <SelectItem value="Motor">Motor</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm font-medium text-destructive">{errors.category}</p>
                        )}
                    </div>

                    {/* Harga */}
                    <div className="space-y-2">
                        <Label htmlFor="add-price" className="relative">
                            Harga Persatuan (Rp) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm z-10">
                                Rp.
                            </span>
                            <Input
                                id="add-price"
                                type="number"
                                min={0}
                                placeholder="50000"
                                value={form.price}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, price: e.target.value }));
                                    setErrors((r) => ({ ...r, price: '' }));
                                }}
                                disabled={isPending}
                                className="pl-10"
                            />
                        </div>
                        {errors.price && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <Label htmlFor="add-stock" className="relative">
                            Stok Tersedia <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="add-stock"
                            type="number"
                            min={0}
                            placeholder="Misal: 10"
                            value={form.stock}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, stock: e.target.value }));
                                setErrors((r) => ({ ...r, stock: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.stock && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.stock}
                            </p>
                        )}
                    </div>
                </div>

                {/* Error API */}
                {(createMutation.isError || updateMutation.isError) && (
                    <p className="text-sm font-medium text-destructive">
                        {(createMutation.error as Error)?.message ||
                            (updateMutation.error as Error)?.message ||
                            'Terjadi kesalahan. Silakan coba lagi.'}
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/addons')}
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyimpan...
                            </span>
                        ) : (
                            action
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};
