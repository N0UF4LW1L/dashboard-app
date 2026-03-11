'use client';

import { useEffect, useState } from 'react';
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
import { useCreateVehicle, useUpdateVehicle } from '@/hooks/api/use-vehicle-mutations';
import { useGetLocations } from '@/hooks/api/use-location';

interface Vehicle {
    id: string;
    name: string;
    rentalPrice: number;
    type: string;
    locationId?: string;
}

interface VehicleFormProps {
    initialData: Vehicle | null;
}

const VEHICLE_TYPES = [
    { id: 'MPV', name: 'MPV' },
    { id: 'SUV', name: 'SUV' },
    { id: 'Sedan', name: 'Sedan' },
    { id: 'Pick Up', name: 'Pick Up' },
    { id: 'Minibus', name: 'Minibus' },
    { id: 'Truk', name: 'Truk' },
    { id: 'Motor', name: 'Motor' },
    { id: 'Van', name: 'Van' },
];



export const VehicleForm: React.FC<VehicleFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Kendaraan' : 'Tambah Kendaraan';
    const description = isEdit ? 'Edit data kendaraan' : 'Tambah kendaraan baru';
    const action = isEdit ? 'Simpan Perubahan' : 'Tambah';

    const createMutation = useCreateVehicle();
    const updateMutation = useUpdateVehicle(initialData?.id ?? '');

    const { data: locations = [], isLoading: isLocationsLoading } = useGetLocations();

    const [form, setForm] = useState({
        name: initialData?.name || '',
        rentalPrice: initialData?.rentalPrice ? String(initialData.rentalPrice) : '',
        type: initialData?.type || '',
        locationId: initialData?.locationId || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama kendaraan wajib diisi';
        if (!form.type) errs.type = 'Tipe kendaraan wajib dipilih';
        if (
            !form.rentalPrice ||
            isNaN(Number(form.rentalPrice)) ||
            Number(form.rentalPrice) <= 0
        )
            errs.rentalPrice = 'Harga sewa harus lebih dari 0';
        if (!form.locationId) errs.locationId = 'Lokasi wajib dipilih';
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
            rentalPrice: Number(form.rentalPrice),
            type: form.type,
            locationId: form.locationId,
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload as any, {
            onSuccess: () => {
                router.push('/dashboard/vehicles');
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
                        <Label htmlFor="veh-name" className="relative">
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="veh-name"
                            placeholder="Nama Kendaraan"
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

                    {/* Tipe */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-type" className="relative">
                            Tipe <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.type}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, type: v }));
                                setErrors((r) => ({ ...r, type: '' }));
                            }}
                            disabled={isPending}
                        >
                            <SelectTrigger id="veh-type">
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                {VEHICLE_TYPES.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm font-medium text-destructive">{errors.type}</p>
                        )}
                    </div>

                    {/* Harga Sewa */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-price" className="relative">
                            Harga Sewa / Hari <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm z-10">
                                Rp.
                            </span>
                            <Input
                                id="veh-price"
                                type="number"
                                min={0}
                                placeholder="500000"
                                value={form.rentalPrice}
                                onChange={(e) => {
                                    setForm((f) => ({ ...f, rentalPrice: e.target.value }));
                                    setErrors((r) => ({ ...r, rentalPrice: '' }));
                                }}
                                disabled={isPending}
                                className="pl-10"
                            />
                        </div>
                        {errors.rentalPrice && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.rentalPrice}
                            </p>
                        )}
                    </div>

                    {/* Lokasi */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-location" className="relative">
                            Lokasi / Pool <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={form.locationId}
                            onValueChange={(v) => {
                                setForm((f) => ({ ...f, locationId: v }));
                                setErrors((r) => ({ ...r, locationId: '' }));
                            }}
                            disabled={isPending || isLocationsLoading}
                        >
                            <SelectTrigger id="veh-location">
                                <SelectValue placeholder="Pilih lokasi penyewaan" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((loc: any) => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.locationId && (
                            <p className="text-sm font-medium text-destructive">{errors.locationId}</p>
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
                        onClick={() => router.push('/dashboard/vehicles')}
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
