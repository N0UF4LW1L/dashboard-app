'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeleteLocation } from '@/hooks/api/use-location-mutations';

interface Location {
    id: string;
    name: string;
    address: string;
}

interface CellActionProps {
    data: Location;
}

export const LocationCellAction: React.FC<CellActionProps> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
    const { mutate: deleteLocation, isPending } = useDeleteLocation();

    const onConfirm = () => {
        setErrorMsg(null);
        deleteLocation(data.id, {
            onSuccess: () => setOpen(false),
            onError: (err: any) => {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Gagal menghapus lokasi. Silakan coba lagi.';
                setErrorMsg(msg);
            },
        });
    };

    const handleOpen = () => {
        setErrorMsg(null);
        setOpen(true);
    };

    return (
        <>
            {/* Dialog konfirmasi hapus */}
            {open && (
                <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/50">
                    <div className="bg-background rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border">
                        <h3 className="font-semibold text-lg mb-1">Konfirmasi Hapus</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Apakah Anda yakin ingin menghapus lokasi{' '}
                            <span className="font-medium text-foreground">{data.name}</span>?
                            Tindakan ini tidak dapat diurungkan.
                        </p>

                        {errorMsg && (
                            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setOpen(false);
                                    setErrorMsg(null);
                                }}
                                disabled={isPending}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={onConfirm}
                                disabled={isPending}
                            >
                                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/location/${data.id}/edit`);
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpen();
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
