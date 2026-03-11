'use client';

import BreadCrumb from '@/components/breadcrumb';
import { LocationForm } from '../_components/location-form';

const breadcrumbItems = [
    { title: 'Lokasi', link: '/dashboard/location' },
    { title: 'Tambah', link: '/dashboard/location/create' },
];

export default function CreateLocationPage() {
    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <LocationForm initialData={null} key="create" />
        </div>
    );
}
