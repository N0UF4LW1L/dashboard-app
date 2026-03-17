"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ReimburseDetailProps {
  data: any;
}

export const RekapReimburseForm: React.FC<ReimburseDetailProps> = ({ data }) => {
  if (!data) return <div>Data tidak ditemukan</div>;

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "terkonfirmasi":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Terkonfirmasi";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      default:
        return status ?? "-";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Detail Reimburse" description="Detail lengkap transaksi reimburse" />
      </div>
      <Separator />

      <div className="space-y-8 w-full pt-4">
        {/* Row 1 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Nama Driver</Label>
            <Input disabled value={data.driver?.name || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total</Label>
            <Input disabled value={formatRupiah(data.nominal || 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Tanggal</Label>
            <Input disabled value={formatDate(data.date) || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>No Rekening</Label>
            <Input disabled value={data.noRekening || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Nama Bank</Label>
            <Input disabled value={data.bank || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Kebutuhan</Label>
            <Input disabled value={data.description || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Status */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <Label>Status</Label>
            <div className="mt-2">
              <Badge
                className={`${getStatusBadgeClass(data.status)} w-full h-10 flex items-center justify-center text-lg font-semibold tracking-widest`}
              >
                {getStatusLabel(data.status)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
