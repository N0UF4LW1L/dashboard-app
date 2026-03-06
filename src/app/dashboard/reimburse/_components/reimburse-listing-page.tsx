'use client';

import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReimburseTable } from '@/app/dashboard/reimburse/_components/reimburse-table';

export default function ReimburseListingPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Reimburse`}
                        description="Kelola data pengajuan reimbursement."
                    />
                    <Link
                        href="/dashboard/reimburse/new"
                        className={buttonVariants({ variant: 'default' })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Link>
                </div>
                <Separator />
                <ReimburseTable />
            </div>
        </div>
    );
}
