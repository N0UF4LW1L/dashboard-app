"use client";

import React from "react";
import { use } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { RekapReimburseForm } from "@/app/dashboard/rekap-pencatatan/_components/rekap-reimburse-form";
import Spinner from "@/components/spinner";
import { useGetReimburseById } from "@/hooks/api/use-rekap";

export default function ReimburseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isFetching } = useGetReimburseById(id);

  const breadcrumbItems = [
    { title: "Rekap Pencatatan", link: "/dashboard/rekap-pencatatan" },
    { title: "Detail Reimburse", link: `/dashboard/rekap-pencatatan/reimburse/${id}/detail` },
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      {isFetching && <Spinner />}
      {!isFetching && data && <RekapReimburseForm data={data} />}
      {!isFetching && !data && (
        <div className="text-center py-8 text-muted-foreground">Data tidak ditemukan</div>
      )}
    </div>
  );
}
