'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateOrder, useUpdateOrder, CreateOrderPayload } from '@/hooks/api/use-order-mutations';
import { useGetCustomers } from '@/hooks/api/use-customer';
import { useGetVehicles } from '@/hooks/api/use-vehicle';

interface Order {
    id: string;
    customer: { id: string };
    vehicle: { id: string };
    customerId: string;
    vehicleId: string;
    rentalDays: number;
    startDate: string;
    endDate?: string;
    usageArea: string;
    insuranceFee: number;
    pickupFee?: number;
    additionalItems?: string;
    paymentStatus: string;
}

interface OrderFormProps {
    initialData: Order | null;
}

const formatToDatetimeLocal = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const offset = d.getTimezoneOffset() * 60000;
    return (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
};

function computeEndDate(startDate: string, rentalDays: string): string {
    if (!startDate || !rentalDays || Number(rentalDays) <= 0) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + Number(rentalDays));
    start.setHours(start.getHours() - 1);
    const offset = start.getTimezoneOffset() * 60000;
    return (new Date(start.getTime() - offset)).toISOString().slice(0, 16);
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Pesanan' : 'Tambah Pesanan';
    const description = isEdit ? 'Edit data pesanan rental' : 'Buat pesanan sewa baru';
    const action = isEdit ? 'Simpan Perubahan' : 'Buat Pesanan';

    const createMutation = useCreateOrder();
    const updateMutation = useUpdateOrder(initialData?.id ?? '');

    const { data: customers = [], isLoading: loadingCustomers } = useGetCustomers();
    const { data: vehicles = [], isLoading: loadingVehicles } = useGetVehicles();

    const formStartDate = formatToDatetimeLocal(initialData?.startDate);
    const formRentalDays = initialData?.rentalDays?.toString() || '';
    const formEndDate = initialData ? computeEndDate(formStartDate, formRentalDays) : '';

    const [form, setForm] = useState({
        customerId: initialData?.customer?.id || initialData?.customerId || '',
        vehicleId: initialData?.vehicle?.id || initialData?.vehicleId || '',
        rentalDays: formRentalDays,
        startDate: formStartDate,
        endDate: formEndDate,
        usageArea: initialData?.usageArea || 'Dalam Kota',
        insuranceFee: initialData?.insuranceFee?.toString() || '',
        pickupFee: initialData?.pickupFee?.toString() || '',
        additionalItems: initialData?.additionalItems || '',
        paymentStatus: initialData?.paymentStatus || 'Belum Lunas',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.customerId) errs.customerId = 'Pelanggan wajib dipilih';
        if (!form.vehicleId) errs.vehicleId = 'Kendaraan/Armada wajib dipilih';
        if (!form.rentalDays || Number(form.rentalDays) <= 0) errs.rentalDays = 'Durasi sewa minimal 1 hari';
        if (!form.startDate) errs.startDate = 'Tanggal mulai wajib diisi';
        if (!form.insuranceFee) errs.insuranceFee = 'Biaya asuransi wajib diisi';
        return errs;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const payload: CreateOrderPayload = {
            customerId: form.customerId,
            vehicleId: form.vehicleId,
            rentalDays: Number(form.rentalDays),
            startDate: form.startDate,
            usageArea: form.usageArea,
            insuranceFee: Number(form.insuranceFee),
            pickupFee: form.pickupFee ? Number(form.pickupFee) : undefined,
            additionalItems: form.additionalItems || undefined,
            paymentStatus: form.paymentStatus,
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload, {
            onSuccess: () => {
                router.push('/dashboard/orders');
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
                    {/* Pelanggan */}
                    <div className="space-y-2">
                        <Label>Pelanggan <span className="text-red-500">*</span></Label>
                        <Select
                            disabled={isPending || loadingCustomers}
                            value={form.customerId}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, customerId: v }));
                                setErrors((prev) => ({ ...prev, customerId: '' }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Pelanggan" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
                    </div>

                    {/* Kendaraan */}
                    <div className="space-y-2">
                        <Label>Armada/Kendaraan <span className="text-red-500">*</span></Label>
                        <Select
                            disabled={isPending || loadingVehicles}
                            value={form.vehicleId}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, vehicleId: v }));
                                setErrors((prev) => ({ ...prev, vehicleId: '' }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Armada" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map((v: any) => (
                                    <SelectItem key={v.id} value={v.id}>
                                        {v.name} ({v.type})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId}</p>}
                    </div>

                    {/* Tanggal Mulai */}
                    <div className="space-y-2">
                        <Label>Tanggal Mulai (Pengambilan) <span className="text-red-500">*</span></Label>
                        <Input
                            type="datetime-local"
                            value={form.startDate ?? ''}
                            onChange={(e) => {
                                const sd = e.target.value;
                                setForm((f) => ({
                                    ...f,
                                    startDate: sd,
                                    endDate: computeEndDate(sd, f.rentalDays),
                                }));
                                setErrors((prev) => ({ ...prev, startDate: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                    </div>

                    {/* Durasi Sewa */}
                    <div className="space-y-2">
                        <Label>Lama Sewa (Hari) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Misal: 3"
                            value={form.rentalDays ?? ''}
                            onChange={(e) => {
                                const rd = e.target.value;
                                setForm((f) => ({
                                    ...f,
                                    rentalDays: rd,
                                    endDate: computeEndDate(f.startDate, rd),
                                }));
                                setErrors((prev) => ({ ...prev, rentalDays: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.rentalDays && <p className="text-sm text-destructive">{errors.rentalDays}</p>}
                    </div>

                    {/* Tanggal Akhir */}
                    <div className="space-y-2">
                        <Label>Tanggal Akhir (Pengembalian)</Label>
                        <Input
                            type="datetime-local"
                            value={form.endDate ?? ''}
                            readOnly
                            disabled
                            className="bg-muted text-muted-foreground cursor-not-allowed"
                        />
                    </div>

                    {/* Area Penggunaan */}
                    <div className="space-y-2">
                        <Label>Area Penggunaan <span className="text-red-500">*</span></Label>
                        <Select
                            disabled={isPending}
                            value={form.usageArea}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, usageArea: v }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dalam Kota">Dalam Kota</SelectItem>
                                <SelectItem value="Luar Kota">Luar Kota</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Pembayaran */}
                    <div className="space-y-2">
                        <Label>Status Pembayaran <span className="text-red-500">*</span></Label>
                        <Select
                            disabled={isPending}
                            value={form.paymentStatus}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, paymentStatus: v }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                                <SelectItem value="Lunas">Lunas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Asuransi */}
                    <div className="space-y-2">
                        <Label>Biaya Asuransi (Rp) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Misal: 50000"
                            value={form.insuranceFee ?? ''}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, insuranceFee: e.target.value }));
                                setErrors((prev) => ({ ...prev, insuranceFee: '' }));
                            }}
                            disabled={isPending}
                        />
                        {errors.insuranceFee && <p className="text-sm text-destructive">{errors.insuranceFee}</p>}
                    </div>

                    {/* Biaya Penjemputan */}
                    <div className="space-y-2">
                        <Label>Biaya Tambahan / Penjemputan (opsional)</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="Misal: 25000"
                            value={form.pickupFee ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, pickupFee: e.target.value }))}
                            disabled={isPending}
                        />
                    </div>

                    {/* Addons */}
                    <div className="space-y-2 md:col-span-2">
                        <Label>Catatan / Item Tambahan (opsional)</Label>
                        <Input
                            placeholder="Misal: Extra driver, tambahan baby seat"
                            value={form.additionalItems ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, additionalItems: e.target.value }))}
                            disabled={isPending}
                        />
                    </div>
                </div>

                {/* Error API */}
                {(createMutation.isError || updateMutation.isError) && (
                    <p className="text-sm font-medium text-destructive">
                        {(createMutation.error as any)?.response?.data?.message ||
                            (updateMutation.error as any)?.response?.data?.message ||
                            'Terjadi kesalahan. Silakan periksa kembali input Anda.'}
                    </p>
                )}

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/orders')}
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