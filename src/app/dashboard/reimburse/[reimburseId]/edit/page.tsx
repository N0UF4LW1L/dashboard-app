'use client';

import BreadCrumb from '@/components/breadcrumb';
import { ReimburseForm } from '../../_components/reimburse-form';
import Spinner from '@/components/spinner';
import { useGetReimburses } from '@/hooks/api/use-reimburse';
import { use } from 'react';

export default function EditReimbursePage({
    params,
}: {
    params: Promise<{ reimburseId: string }>;
}) {
    const { reimburseId } = use(params);
    const { data: reimburses = [], isLoading } = useGetReimburses();
    const reimburse = reimburses.find((r: any) => r.id === reimburseId) ?? null;

    const breadcrumbItems = [
        { title: 'Reimburse', link: '/dashboard/reimburse' },
        {
            title: 'Edit',
            link: `/dashboard/reimburse/${reimburseId}/edit`,
        },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <ReimburseForm
                    initialData={reimburse}
                    key={reimburseId}
                />
            )}
        </div>
    );
}
