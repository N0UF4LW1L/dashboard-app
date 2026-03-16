import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import type { Metadata } from 'next';
import InventoryTableWrapper from './_components/inventory-table-wrapper';

const breadcrumbItems = [{ title: 'Inventaris', link: '/dashboard/inventory' }];

export const metadata: Metadata = {
  title: 'Inventaris | Transgo',
  description: 'Manage company inventory and assets',
};

export default function InventoryPage() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Inventaris" description="Kelola aset dan inventaris perusahaan" />
        </div>
        <Separator />

        <InventoryTableWrapper />
      </div>
    </>
  );
}
