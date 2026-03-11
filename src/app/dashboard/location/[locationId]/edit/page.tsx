'use client';

import { use } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { LocationForm } from '../../_components/location-form';
import Spinner from '@/components/spinner';
import { useGetLocationById } from '@/hooks/api/use-location';

export default function EditLocationPage({ params }: { params: Promise<{ locationId: string }> }) {
    const { locationId } = use(params);

    const { data: location, isLoading } = useGetLocationById(locationId);

    const breadcrumbItems = [
        { title: 'Lokasi', link: '/dashboard/location' },
        { title: 'Edit', link: `/dashboard/location/${locationId}/edit` },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <LocationForm
                    initialData={location ?? null}
                    key={locationId}
                />
            )}
        </div>
    );
}
