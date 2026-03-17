"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface InventarisDetailProps {
  data: any;
}

export const RekapInventarisForm: React.FC<InventarisDetailProps> = ({ data }) => {
  if (!data) return <div>Data tidak ditemukan</div>;

  const totalHarga = (data.unitPrice ?? 0) * (data.quantity ?? 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Detail Inventaris" description="Detail lengkap aset inventaris" />
      </div>
      <Separator />

      <div className="space-y-8 w-full pt-4">
        {/* Row 1 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Nama Aset</Label>
            <Input disabled value={data.assetName || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Jumlah</Label>
            <Input disabled value={data.quantity ?? "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Tanggal Pembelian</Label>
            <Input disabled value={formatDate(data.purchaseDate) || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Harga Satuan</Label>
            <Input disabled value={formatRupiah(data.unitPrice ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total Harga</Label>
            <Input disabled value={formatRupiah(totalHarga)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Kategori</Label>
            <Input disabled value={data.category || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 3 */}
        {data.description && (
          <div>
            <Label>Deskripsi</Label>
            <Input disabled value={data.description} className="disabled:opacity-90 mt-2" />
          </div>
        )}

        {/* Status */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <Label>Status</Label>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 w-full h-10 flex items-center justify-center text-lg font-semibold tracking-widest">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
