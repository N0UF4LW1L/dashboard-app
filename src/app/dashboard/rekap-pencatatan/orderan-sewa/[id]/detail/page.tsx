"use client";

import React from "react";
import { use } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { RekapOrderanSewaForm } from "@/app/dashboard/rekap-pencatatan/_components/rekap-orderan-sewa-form";
import Spinner from "@/components/spinner";
import { useGetOrderanSewaById } from "@/hooks/api/use-rekap";

export default function OrderanSewaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isFetching } = useGetOrderanSewaById(id);

  const breadcrumbItems = [
    { title: "Rekap Pencatatan", link: "/dashboard/rekap-pencatatan" },
    { title: "Detail Orderan Fleets", link: `/dashboard/rekap-pencatatan/orderan-sewa/${id}/detail` },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data && <RekapOrderanSewaForm data={data} />}
      {!isFetching && !data && (
        <div className="text-center py-8 text-muted-foreground">Data tidak ditemukan</div>
      )}
    </div>
  );
}
