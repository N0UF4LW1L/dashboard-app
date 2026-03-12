'use client';

import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddonTable from './_components/addon-table';
import { useGetAddons } from '@/hooks/api/use-addon';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Addons', link: '/dashboard/addons' },
];

export default function page() {
    const router = useRouter();
    const { data = [], isLoading } = useGetAddons();

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <BreadCrumb items={breadcrumbItems} />

            <div className="flex items-start justify-between">
                <Heading
                    title={`Add-ons (${data.length})`}
                    description="Kelola add-ons (aksesoris / item tambahan) yang bisa disewa untuk kendaraan."
                />
                <Button
                    onClick={() => router.push('/dashboard/addons/create')}
                    className="bg-[#1F61D9] hover:bg-[#1a52b8] text-white"
                >
                    <Plus className="mr-2 h-4 w-4" /> Tambah Baru
                </Button>
            </div>

            <AddonTable data={data} isLoading={isLoading} />
        </div>
    );
}
