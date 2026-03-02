'use client';

import BreadCrumb from '@/components/breadcrumb';
import { CustomerForm } from '../_components/customer-form';

const breadcrumbItems = [
    { title: 'Customers', link: '/dashboard/customers' },
    { title: 'Tambah', link: '/dashboard/customers/create' },
];

export default function CreateCustomerPage() {
    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <CustomerForm initialData={null} key="create" />
        </div>
    );
}
