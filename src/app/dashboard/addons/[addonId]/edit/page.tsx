'use client';

import BreadCrumb from '@/components/breadcrumb';
import { AddonForm } from '../../_components/addon-form';
import { useGetAddonById } from '@/hooks/api/use-addon';
import { useParams } from 'next/navigation';

export default function page() {
    const params = useParams();
    const addonId = params.addonId as string;

    const { data, isLoading, error } = useGetAddonById(addonId);

    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Addons', link: '/dashboard/addons' },
        { title: 'Edit', link: `/dashboard/addons/${addonId}/edit` },
    ];

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-8">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex h-[200px] items-center justify-center">
                    Loading...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex-1 space-y-4 p-8">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex h-[200px] items-center justify-center text-destructive">
                    Data tidak ditemukan.
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <AddonForm initialData={data} />
        </div>
    );
}
