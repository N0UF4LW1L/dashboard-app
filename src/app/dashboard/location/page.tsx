'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useGetLocations } from '@/hooks/api/use-location';
import LocationTable from './_components/location-table';

const breadcrumbItems = [{ title: 'Lokasi', link: '/dashboard/location' }];

export default function LocationPage() {
    const { data: locations = [], isLoading } = useGetLocations();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title={`Lokasi (${locations.length})`}
                    description="Kelola data lokasi / pool kendaraan armada TransGo"
                />
                <Link href="/dashboard/location/create">
                    <Button className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                    </Button>
                </Link>
            </div>

            <Separator />

            <LocationTable
                data={locations}
                isLoading={isLoading}
            />
        </div>
    );
}
