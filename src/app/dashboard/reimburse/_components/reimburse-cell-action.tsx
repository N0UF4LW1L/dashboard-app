'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUploadReceipt, useUpdateReimburse, useDeleteReimburse } from '@/hooks/api/use-reimburse-mutations';
import { Loader2, Search } from 'lucide-react';

export const ReimburseCellAction = ({ data }: { data: any }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const uploadReceiptMutation = useUploadReceipt(data.id);
    const updateReimburseMutation = useUpdateReimburse(data.id);
    const deleteMutation = useDeleteReimburse();

    const handleUpload = async () => {
        const fakeUrl = 'https://example.com/receipt-' + Date.now() + '.jpg';
        if (confirm('Simulasi upload bukti bayar. URL Bukti akan di-set menjadi: ' + fakeUrl)) {
            setLoading(true);
            await uploadReceiptMutation.mutateAsync(fakeUrl);
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (confirm('Yakin ingin Konfirmasi (Approve) khusus tagihan ini?')) {
            setLoading(true);
            await updateReimburseMutation.mutateAsync({ status: 'confirmed' });
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (confirm('Yakin ingin MENOLAK tagihan ini?')) {
            setLoading(true);
            await updateReimburseMutation.mutateAsync({ status: 'rejected' });
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm('Yakin ingin menghapus tagihan? Tindakan ini tidak dapat dibatalkan.')) {
            setLoading(true);
            await deleteMutation.mutateAsync(data.id);
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            {data.status === 'request' && (
                <Button size="sm" variant="outline" onClick={handleUpload} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload Bukti'}
                </Button>
            )}

            {data.status === 'pending' && (
                <>
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Konfirmasi'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleReject} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tolak'}
                    </Button>
                </>
            )}

            {/* Basic Actions */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/reimburse/${data.id}/edit`)}
            >
                Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={handleDelete} disabled={loading}>
                Hapus
            </Button>
        </div>
    );
};
