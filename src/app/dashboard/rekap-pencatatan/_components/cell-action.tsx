'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeleteLainnya } from '@/hooks/api/use-rekap-mutations';
import { toast } from 'sonner';

interface CellActionProps {
  data: any;
  type: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, type }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const deleteMutation = useDeleteLainnya();

  const onConfirm = async () => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      try {
        setLoading(true);
        await deleteMutation.mutateAsync(data.id);
        toast.success('Data berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus data');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/rekap-pencatatan/${type}/${data.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Perbarui
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onConfirm} disabled={loading} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
