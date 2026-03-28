"use client";

import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useGetDetailPlanning } from "@/hooks/api/use-planning";
import DaftarAkunTab from "./_components/daftar-akun-tab";
import RencanaTab from "./_components/rencana-tab";
import LaporanTab from "./_components/laporan-tab";

export default function DetailPerencanaanPage() {
  const params = useParams();
  const planningId = params.planningId as string;
  const [activeTab, setActiveTab] = useState("rencana");

  const { data: planningData, isLoading, error } = useGetDetailPlanning(planningId);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !planningData?.data) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-red-600">Perencanaan tidak ditemukan</p>
      </div>
    );
  }

  const planning = planningData.data;
  const breadcrumbItems = [
    { title: "Perencanaan", link: "/dashboard/perencanaan" },
    { title: planning.name, link: "#" },
  ];

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={planning.name}
            description={`${planning.period ? planning.period + " " : ""}${planning.year || ""} — ${planning.description || "Perencanaan Keuangan"}`}
          />
        </div>
        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daftar-akun">Daftar Akun</TabsTrigger>
            <TabsTrigger value="rencana">Rencana</TabsTrigger>
            <TabsTrigger value="laporan">Laporan</TabsTrigger>
          </TabsList>

          <TabsContent value="daftar-akun" className="space-y-4">
            <DaftarAkunTab />
          </TabsContent>

          <TabsContent value="rencana" className="space-y-4">
            <RencanaTab planningId={planningId} />
          </TabsContent>

          <TabsContent value="laporan" className="space-y-4">
            <LaporanTab planningId={planningId} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
