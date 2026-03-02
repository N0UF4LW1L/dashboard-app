'use client';

import BreadCrumb from '@/components/breadcrumb';
import { VehicleForm } from '../_components/vehicle-form';

const breadcrumbItems = [
    { title: 'Kendaraan', link: '/dashboard/vehicles' },
    { title: 'Tambah', link: '/dashboard/vehicles/create' },
];

export default function CreateVehiclePage() {
    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            <VehicleForm initialData={null} key="create" />
        </div>
    );
}
