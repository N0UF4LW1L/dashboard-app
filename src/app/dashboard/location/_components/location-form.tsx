'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLocation, useUpdateLocation } from '@/hooks/api/use-location-mutations';

interface Location {
    id: string;
    name: string;
    address: string;
}

interface LocationFormProps {
    initialData: Location | null;
}

export const LocationForm: React.FC<LocationFormProps> = ({ initialData }) => {
    const router = useRouter();
    const isEdit = !!initialData;

    const title = isEdit ? 'Edit Lokasi' : 'Tambah Lokasi';
    const description = isEdit ? 'Edit data lokasi' : 'Tambah lokasi baru';
    const action = isEdit ? 'Simpan Perubahan' : 'Tambah';

    const createMutation = useCreateLocation();
    const updateMutation = useUpdateLocation(initialData?.id ?? '');

    const [form, setForm] = useState({
        name: initialData?.name || '',
        address: initialData?.address || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Nama lokasi wajib diisi';
        if (!form.address.trim()) errs.address = 'Alamat lokasi wajib diisi';
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
            address: form.address.trim(),
        };

        const mutation = isEdit ? updateMutation : createMutation;
        mutation.mutate(payload as any, {
            onSuccess: () => {
                router.push('/dashboard/location');
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
                    {/* Nama Lokasi */}
                    <div className="space-y-2">
                        <Label htmlFor="loc-name" className="relative">
                            Nama Lokasi <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="loc-name"
                            placeholder="Nama Lokasi"
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

                    {/* Alamat */}
                    <div className="space-y-2">
                        <Label htmlFor="loc-address" className="relative">
                            Alamat <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="loc-address"
                            placeholder="Alamat lengkap lokasi"
                            value={form.address}
                            onChange={(e) => {
                                setForm((f) => ({ ...f, address: e.target.value.trimStart() }));
                                setErrors((r) => ({ ...r, address: '' }));
                            }}
                            disabled={isPending}
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm font-medium text-destructive">{errors.address}</p>
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
                        onClick={() => router.push('/dashboard/location')}
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
