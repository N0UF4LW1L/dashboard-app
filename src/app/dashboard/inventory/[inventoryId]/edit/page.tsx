'use client';

import { use } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { InventoryForm } from '../../_components/inventory-form';
import Spinner from '@/components/spinner';
import { useGetInventoryById } from '@/hooks/api/use-inventory';

export default function EditInventoryPage({ params }: { params: Promise<{ inventoryId: string }> }) {
    const { inventoryId } = use(params);

    const { data: inventory, isLoading } = useGetInventoryById(inventoryId);

    const breadcrumbItems = [
        { title: 'Inventaris', link: '/dashboard/inventory' },
        { title: 'Edit', link: `/dashboard/inventory/${inventoryId}/edit` },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <InventoryForm
                    initialData={inventory ?? null}
                    key={inventoryId}
                />
            )}
        </div>
    );
}
