'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Loader2 } from 'lucide-react';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/api/use-customer-mutations';

interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
}

interface CustomerFormProps {
    initialData: Customer | null;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Customer' : 'Tambah Customer';
    const description = isEdit ? 'Edit data customer' : 'Add a new Customer';
    const action = isEdit ? 'Save changes' : 'Create';

    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer(initialData?.id ?? '');

    const [form, setForm] = useState({
        name: initialData?.name || '',
        phoneNumber: initialData?.phoneNumber || '',
        email: initialData?.email || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama customer wajib diisi';
        if (!form.phoneNumber.trim()) errs.phoneNumber = 'Nomor telepon wajib diisi';
        if (!form.email.trim()) {
            errs.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = 'Email tidak valid';
        }
        return errs;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const payload = {
            name: form.name.trim(),
            phoneNumber: form.phoneNumber.trim(),
            email: form.email.trim(),
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload, {
            onSuccess: () => {
                router.push('/dashboard/customers');
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
                <div className="md:grid md:grid-cols-3 gap-8">
                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="cust-name" className="relative">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cust-name"
                            placeholder="Nama Customer"
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

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="cust-email" className="relative">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cust-email"
                            type="email"
                            placeholder="email@example.com"
                            value={form.email}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, email: e.target.value.trimStart() }));
                                setErrors((r) => ({ ...r, email: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.email && (
                            <p className="text-sm font-medium text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Nomor Telepon */}
                    <div className="space-y-2">
                        <Label htmlFor="cust-phone" className="relative">
                            Nomor Telepon <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="cust-phone"
                            type="tel"
                            placeholder="08123456789"
                            value={form.phoneNumber}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, phoneNumber: e.target.value }));
                                setErrors((r) => ({ ...r, phoneNumber: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.phoneNumber && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Error API */}
                {(createMutation.isError || updateMutation.isError) && (
                    <p className="text-sm font-medium text-destructive">
                        {(createMutation.error as any)?.response?.data?.message ||
                            (updateMutation.error as any)?.response?.data?.message ||
                            'Terjadi kesalahan. Silakan coba lagi.'}
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/customers')}
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
