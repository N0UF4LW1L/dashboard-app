import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import type { Metadata } from 'next';
import RekapPencatatanTableWrapper from './_components/rekap-pencatatan-table-wrapper';

const breadcrumbItems = [{ title: 'Rekap Pencatatan', link: '/dashboard/rekap-pencatatan' }];

export const metadata: Metadata = {
  title: 'Rekap Pencatatan | Transgo',
  description: 'Rekap laporan pencatatan transaksi',
};

export default function RekapPencatatanPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Rekap Pencatatan" description="Kelola dan pantau rekap keuangan harian maupun bulanan" />
        </div>
        <Separator />
        
        {/* Force Turbopack Cache Invalidation */}
        <RekapPencatatanTableWrapper />
      </div>
    </>
  );
}
