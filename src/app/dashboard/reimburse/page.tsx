'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReimburseTable } from './_components/reimburse-table';
import DriverReimburseUrlCard from './_components/driver-reimburse-url-card';

const breadcrumbItems = [{ title: 'Reimburse', link: '/dashboard/reimburse' }];

export default function ReimbursePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title="Reimburse"
                    description="Kelola data pengajuan reimbursement."
                />
                <Link href="/dashboard/reimburse/new">
                    <Button className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Button>
                </Link>
            </div>

            <Separator />

            <DriverReimburseUrlCard />

            <Separator />

            <ReimburseTable />
        </div>
    );
}
