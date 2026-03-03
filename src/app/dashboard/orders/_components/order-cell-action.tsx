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
import { useDeleteOrder } from '@/hooks/api/use-order-mutations';

interface Order {
    id: string;
}

interface CellActionProps {
    data: Order;
}

export const OrderCellAction: React.FC<CellActionProps> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { mutate: deleteOrder, isPending } = useDeleteOrder();

    const onConfirm = () => {
        deleteOrder(data.id, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
                    <div className="bg-background rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 border">
                        <h3 className="font-semibold text-lg mb-1">Konfirmasi Hapus</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat diurungkan.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
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
                            router.push(`/dashboard/orders/${data.id}/edit`);
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
