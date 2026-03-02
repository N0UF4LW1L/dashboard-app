'use client';

import BreadCrumb from '@/components/breadcrumb';
import { VehicleForm } from '../../_components/vehicle-form';
import Spinner from '@/components/spinner';
import { useGetVehicles } from '@/hooks/api/use-vehicle';

export default function EditVehiclePage({ params }: { params: { vehicleId: string } }) {
    const { data: vehicles = [], isLoading } = useGetVehicles();
    const vehicle = vehicles.find((v: any) => v.id === params.vehicleId) ?? null;

    const breadcrumbItems = [
        { title: 'Kendaraan', link: '/dashboard/vehicles' },
        { title: 'Edit', link: `/dashboard/vehicles/${params.vehicleId}/edit` },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <VehicleForm
                    initialData={vehicle}
                    key={params.vehicleId}
                />
            )}
        </div>
    );
}
