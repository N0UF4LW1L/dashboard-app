'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useGetCustomers } from '@/hooks/api/use-customer';
import CustomerTable from './_components/customer-table';

const breadcrumbItems = [{ title: 'Customers', link: '/dashboard/customers' }];

export default function CustomersPage() {
    const { data: customers = [], isLoading } = useGetCustomers();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title="Customers"
                    description="Kelola data pelanggan TransGo"
                />
                <Link href="/dashboard/customers/create">
                    <Button className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </Link>
            </div>

            <Separator />

            <CustomerTable data={customers} isLoading={isLoading} />
        </div>
    );
}
