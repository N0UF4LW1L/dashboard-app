'use client';

import { use } from 'react'; // 1. Import 'use' dari react
import BreadCrumb from '@/components/breadcrumb';
import { VehicleForm } from '../../_components/vehicle-form';
import Spinner from '@/components/spinner';
import { useGetVehicleById } from '@/hooks/api/use-vehicle';

// 2. Update tipe data params menjadi Promise
export default function EditVehiclePage({ params }: { params: Promise<{ vehicleId: string }> }) {
    // 3. Unwrap params menggunakan hook 'use'
    const { vehicleId } = use(params);
    
    const { data: vehicle, isLoading } = useGetVehicleById(vehicleId);

    const breadcrumbItems = [
        { title: 'Kendaraan', link: '/dashboard/vehicles' },
        { title: 'Edit', link: `/dashboard/vehicles/${vehicleId}/edit` },
    ];

    return (
        <div className="flex-1 space-y-4 p-8">
            <BreadCrumb items={breadcrumbItems} />
            {isLoading && <Spinner />}
            {!isLoading && (
                <VehicleForm
                    initialData={vehicle ?? null}
                    key={vehicleId}
                />
            )}
        </div>
    );
}