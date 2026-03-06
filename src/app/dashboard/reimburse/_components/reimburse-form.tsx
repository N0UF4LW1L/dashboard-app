'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateReimburse, useUpdateReimburse } from '@/hooks/api/use-reimburse-mutations';
import { useGetVehicles } from '@/hooks/api/use-vehicle';

interface Reimburse {
    id: string;
    employeeName: string;
    employeeRole: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    vehicleId?: string;
    expenseDate: string;
    expenseSource: string;
    description: string;
}

interface ReimburseFormProps {
    initialData: Reimburse | null;
}

export const ReimburseForm: React.FC<ReimburseFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Reimburse' : 'Pengambilan Reimburse';
    const description = isEdit ? 'Edit data form reimburse' : 'Ajukan form reimburse baru';
    const action = isEdit ? 'Simpan' : 'Request';

    const createMutation = useCreateReimburse();
    const updateMutation = useUpdateReimburse(initialData?.id ?? '');

    const { data: vehicles = [], isLoading: loadingVehicles } = useGetVehicles();

    const [form, setForm] = useState({
        employeeName: initialData?.employeeName || '',
        employeeRole: initialData?.employeeRole || '',
        amount: initialData?.amount ? String(initialData.amount) : '',
        bankName: initialData?.bankName || '',
        accountNumber: initialData?.accountNumber || '',
        vehicleId: initialData?.vehicleId || 'none',
        expenseDate: initialData?.expenseDate ? initialData.expenseDate.split('T')[0] : '',
        expenseSource: initialData?.expenseSource || '',
        description: initialData?.description || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.employeeName.trim()) errs.employeeName = 'Wajib diisi';
        if (!form.employeeRole.trim()) errs.employeeRole = 'Wajib diisi';
        if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Wajib diisi > 0';
        if (!form.bankName.trim()) errs.bankName = 'Wajib diisi';
        if (!form.accountNumber.trim()) errs.accountNumber = 'Wajib diisi';
        if (!form.expenseDate.trim()) errs.expenseDate = 'Wajib diisi';
        if (!form.expenseSource.trim()) errs.expenseSource = 'Wajib diisi';
        if (!form.description.trim()) errs.description = 'Wajib diisi';
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
            employeeName: form.employeeName,
            employeeRole: form.employeeRole,
            amount: Number(form.amount),
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            vehicleId: form.vehicleId === 'none' ? undefined : form.vehicleId,
            expenseDate: form.expenseDate,
            expenseSource: form.expenseSource,
            description: form.description,
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload as any, {
            onSuccess: () => {
                router.push('/dashboard/reimburse');
            },
        });
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="bg-white p-6 border rounded-md">
            <div className="flex items-center justify-between pb-4">
                <Heading title={title} description={description} />
            </div>
            <Separator />
            <form onSubmit={onSubmit} className="space-y-6 pt-6 w-full max-w-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Nama Karyawan <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="John Doe"
                            value={form.employeeName}
                            onChange={(e) => setForm((f) => ({ ...f, employeeName: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.employeeName && <p className="text-sm text-red-500">{errors.employeeName}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Role Karyawan <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Driver"
                            value={form.employeeRole}
                            onChange={(e) => setForm((f) => ({ ...f, employeeRole: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.employeeRole && <p className="text-sm text-red-500">{errors.employeeRole}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Pilih Kendaraan (Opsional)</Label>
                        <Select
                            disabled={isPending || loadingVehicles}
                            value={form.vehicleId}
                            onValueChange={(v) => setForm((f) => ({ ...f, vehicleId: v }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kendaraan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- Tanpa Kendaraan --</SelectItem>
                                {vehicles.map((v: any) => (
                                    <SelectItem key={v.id} value={v.id}>
                                        {v.name} ({v.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Nominal (Rp) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Misal: 350000"
                            value={form.amount}
                            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Tanggal Pengeluaran <span className="text-red-500">*</span></Label>
                        <Input
                            type="date"
                            value={form.expenseDate}
                            onChange={(e) => setForm((f) => ({ ...f, expenseDate: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.expenseDate && <p className="text-sm text-red-500">{errors.expenseDate}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Sumber Pengeluaran <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Bensin Operasional"
                            value={form.expenseSource}
                            onChange={(e) => setForm((f) => ({ ...f, expenseSource: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.expenseSource && <p className="text-sm text-red-500">{errors.expenseSource}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Nama Bank Tujuan Transfer <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="BCA"
                            value={form.bankName}
                            onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.bankName && <p className="text-sm text-red-500">{errors.bankName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>No Rekening <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="123456789"
                            value={form.accountNumber}
                            onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                            disabled={isPending}
                        />
                        {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Keterangan <span className="text-red-500">*</span></Label>
                    <textarea
                        className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Contoh: Bensin dari Jakarta ke Bandung."
                        value={form.description}
                        onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                        disabled={isPending}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/dashboard/reimburse')} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {action}
                    </Button>
                </div>
            </form>
        </div>
    );
};
