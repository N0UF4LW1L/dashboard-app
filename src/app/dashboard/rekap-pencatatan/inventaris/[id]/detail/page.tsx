"use client";

import React from "react";
import { use } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { RekapInventarisForm } from "@/app/dashboard/rekap-pencatatan/_components/rekap-inventaris-form";
import Spinner from "@/components/spinner";
import { useGetInventarisById } from "@/hooks/api/use-rekap";

export default function InventarisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isFetching } = useGetInventarisById(id);

  const breadcrumbItems = [
    { title: "Rekap Pencatatan", link: "/dashboard/rekap-pencatatan" },
    { title: "Detail Inventaris", link: `/dashboard/rekap-pencatatan/inventaris/${id}/detail` },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data && <RekapInventarisForm data={data} />}
      {!isFetching && !data && (
        <div className="text-center py-8 text-muted-foreground">Data tidak ditemukan</div>
      )}
    </div>
  );
}
