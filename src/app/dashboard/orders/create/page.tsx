'use client';

import BreadCrumb from '@/components/breadcrumb';
import { OrderForm } from '../_components/order-form';

const breadcrumbItems = [
    { title: 'Pesanan', link: '/dashboard/orders' },
    { title: 'Tambah', link: '/dashboard/orders/create' },
];

export default function CreateOrderPage() {
    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <OrderForm initialData={null} key="create" />
        </div>
    );
}
