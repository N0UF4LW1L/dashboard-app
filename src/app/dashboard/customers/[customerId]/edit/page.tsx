'use client';

import { use } from 'react'; // 1. Import hook use
import BreadCrumb from '@/components/breadcrumb';
import { CustomerForm } from '../../_components/customer-form';
import Spinner from '@/components/spinner';
import { useGetCustomers } from '@/hooks/api/use-customer';

export default function EditCustomerPage({
    params,
}: {
    // 2. Update tipe data params menjadi Promise
    params: Promise<{ customerId: string }>;
}) {
    // 3. Ambil data customerId menggunakan use()
    const { customerId } = use(params);

    const { data: customers = [], isLoading } = useGetCustomers();
    
    // Gunakan customerId yang sudah di-unwrap
    const customer =
        customers.find((c: any) => c.id === customerId) ?? null;

    const breadcrumbItems = [
        { title: 'Customers', link: '/dashboard/customers' },
        {
            title: 'Edit',
            link: `/dashboard/customers/${customerId}/edit`,
        },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <CustomerForm
                    initialData={customer}
                    key={customerId}
                />
            )}
        </div>
    );
}