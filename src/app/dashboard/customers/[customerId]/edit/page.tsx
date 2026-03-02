'use client';

import BreadCrumb from '@/components/breadcrumb';
import { CustomerForm } from '../../_components/customer-form';
import Spinner from '@/components/spinner';
import { useGetCustomers } from '@/hooks/api/use-customer';

export default function EditCustomerPage({
    params,
}: {
    params: { customerId: string };
}) {
    const { data: customers = [], isLoading } = useGetCustomers();
    const customer =
        customers.find((c: any) => c.id === params.customerId) ?? null;

    const breadcrumbItems = [
        { title: 'Customers', link: '/dashboard/customers' },
        {
            title: 'Edit',
            link: `/dashboard/customers/${params.customerId}/edit`,
        },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <CustomerForm
                    initialData={customer}
                    key={params.customerId}
                />
            )}
        </div>
    );
}
