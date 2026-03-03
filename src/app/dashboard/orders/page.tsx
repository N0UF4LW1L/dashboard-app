'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useGetOrders } from '@/hooks/api/use-order';
import OrderTable from './_components/order-table';

const breadcrumbItems = [{ title: 'Pesanan', link: '/dashboard/orders' }];

export default function OrdersPage() {
    const { data: orders = [], isLoading } = useGetOrders();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title="Pesanan"
                    description="Kelola data pesanan rental TransGo"
                />
                <Link href="/dashboard/orders/create">
                    <Button className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Pesanan
                    </Button>
                </Link>
            </div>

            <Separator />

            <OrderTable data={orders} isLoading={isLoading} />
        </div>
    );
}
