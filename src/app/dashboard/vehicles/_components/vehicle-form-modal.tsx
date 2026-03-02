'use client';

import { useEffect, useState } from 'react';
import { X, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateVehicle, useUpdateVehicle } from '@/hooks/api/use-vehicle-mutations';

interface Vehicle {
    id: string;
    name: string;
    rentalPrice: number;
    type: string;
    isAvailable: boolean;
}

interface VehicleFormModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    vehicle?: Vehicle;
}

const VEHICLE_TYPES = ['MPV', 'SUV', 'Sedan', 'Pick Up', 'Minibus', 'Truk', 'Motor', 'Van'];

export default function VehicleFormModal({
    open,
    onClose,
    mode,
    vehicle,
}: VehicleFormModalProps) {
    const isEdit = mode === 'edit';
    const createMutation = useCreateVehicle();
    const updateMutation = useUpdateVehicle(vehicle?.id ?? '');

    const [form, setForm] = useState({
        name: '',
        rentalPrice: '',
        type: '',
        isAvailable: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Populate form saat mode edit
    useEffect(() => {
        if (isEdit && vehicle) {
            setForm({
                name: vehicle.name,
                rentalPrice: String(vehicle.rentalPrice),
                type: vehicle.type,
                isAvailable: vehicle.isAvailable,
            });
        } else {
            setForm({ name: '', rentalPrice: '', type: '', isAvailable: true });
        }
        setErrors({});
    }, [vehicle, isEdit, open]);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama kendaraan wajib diisi';
        if (!form.type) errs.type = 'Tipe kendaraan wajib dipilih';
        if (!form.rentalPrice || isNaN(Number(form.rentalPrice)) || Number(form.rentalPrice) <= 0)
            errs.rentalPrice = 'Harga sewa harus berupa angka lebih dari 0';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            ...(isEdit && { isAvailable: form.isAvailable }),
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload as any, {
            onSuccess: () => onClose(),
        });
    };

    if (!open) return null;

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 border overflow-hidden"
                style={{ animation: 'scale-in 0.2s ease-out' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#1F61D9] to-blue-700">
                    <div className="flex items-center gap-3 text-white">
                        <Truck className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">
                            {isEdit ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/20"
                        disabled={isPending}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nama */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-name">
                            Nama Kendaraan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="veh-name"
                            placeholder="cth. Toyota Avanza"
                            value={form.name}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, name: e.target.value }));
                                setErrors((e2) => ({ ...e2, name: '' }));
                            }}
                            disabled={isPending}
                            className={errors.name ? 'border-red-400' : ''}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Tipe */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-type">
                            Tipe Kendaraan <span className="text-red-500">*</span>
                        </Label>
                        <select
                            id="veh-type"
                            value={form.type}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, type: e.target.value }));
                                setErrors((r) => ({ ...r, type: '' }));
                            }}
                            disabled={isPending}
                            className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${errors.type ? 'border-red-400' : 'border-input'}`}
                        >
                            <option value="">-- Pilih Tipe --</option>
                            {VEHICLE_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="text-xs text-red-500">{errors.type}</p>
                        )}
                    </div>

                    {/* Harga Sewa */}
                    <div className="space-y-2">
                        <Label htmlFor="veh-price">
                            Harga Sewa / Hari <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                Rp
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
                                className={`pl-9 ${errors.rentalPrice ? 'border-red-400' : ''}`}
                            />
                        </div>
                        {errors.rentalPrice && (
                            <p className="text-xs text-red-500">{errors.rentalPrice}</p>
                        )}
                    </div>

                    {/* Status Ketersediaan (hanya saat edit) */}
                    {isEdit && (
                        <div className="space-y-2">
                            <Label>Status Ketersediaan</Label>
                            <div className="flex gap-3">
                                {[
                                    { label: 'Tersedia', value: true, cls: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
                                    { label: 'Tidak Tersedia', value: false, cls: 'border-red-400 bg-red-50 text-red-700' },
                                ].map((opt) => (
                                    <button
                                        key={String(opt.value)}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, isAvailable: opt.value }))}
                                        disabled={isPending}
                                        className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-all ${form.isAvailable === opt.value
                                            ? opt.cls
                                            : 'border-border text-muted-foreground hover:border-muted-foreground'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error dari API */}
                    {(createMutation.isError || updateMutation.isError) && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                            {(createMutation.error as Error)?.message ||
                                (updateMutation.error as Error)?.message ||
                                'Terjadi kesalahan. Silakan coba lagi.'}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#1F61D9] hover:bg-[#1a52b8] text-white"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    {isEdit ? 'Menyimpan...' : 'Menambahkan...'}
                                </div>
                            ) : isEdit ? (
                                'Simpan Perubahan'
                            ) : (
                                'Tambah Kendaraan'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
