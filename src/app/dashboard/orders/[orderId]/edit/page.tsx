'use client';

import BreadCrumb from '@/components/breadcrumb';
import { OrderForm } from '../../_components/order-form';
import Spinner from '@/components/spinner';
import { useGetOrders } from '@/hooks/api/use-order';

export default function EditOrderPage({
    params,
}: {
    params: { orderId: string };
}) {
    const { data: orders = [], isLoading } = useGetOrders();
    const order = orders.find((o: any) => o.id === params.orderId) ?? null;

    const breadcrumbItems = [
        { title: 'Pesanan', link: '/dashboard/orders' },
        {
            title: 'Edit',
            link: `/dashboard/orders/${params.orderId}/edit`,
        },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <OrderForm
                    initialData={order}
                    key={params.orderId}
                />
            )}
        </div>
    );
}
