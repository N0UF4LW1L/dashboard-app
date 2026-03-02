'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useGetVehicles } from '@/hooks/api/use-vehicle';
import VehicleTable from './_components/vehicle-table';

const breadcrumbItems = [{ title: 'Kendaraan', link: '/dashboard/vehicles' }];

export default function VehiclesPage() {
    const { data: vehicles = [], isLoading } = useGetVehicles();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title={`Kendaraan (${vehicles.length})`}
                    description="Kelola data kendaraan armada TransGo"
                />
                <Link href="/dashboard/vehicles/create">
                    <Button className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Button>
                </Link>
            </div>

            <Separator />

            <VehicleTable
                data={vehicles}
                isLoading={isLoading}
            />
        </div>
    );
}
