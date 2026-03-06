'use client';

import BreadCrumb from '@/components/breadcrumb';
import { OrderForm } from '../../_components/order-form';
import Spinner from '@/components/spinner';
import { useGetOrders } from '@/hooks/api/use-order';
import { use } from 'react';

export default function EditOrderPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = use(params);
    const { data: orders = [], isLoading } = useGetOrders();
    const order = orders.find((o: any) => o.id === orderId) ?? null;

    const breadcrumbItems = [
        { title: 'Pesanan', link: '/dashboard/orders' },
        {
            title: 'Edit',
            link: `/dashboard/orders/${orderId}/edit`,
        },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <OrderForm
                    initialData={order}
                    key={orderId}
                />
            )}
        </div>
    );
}
