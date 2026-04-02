"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface OrderanSewaDetailProps {
  data: any;
}

export const RekapOrderanSewaForm: React.FC<OrderanSewaDetailProps> = ({ data }) => {
  if (!data) return <div>Data tidak ditemukan</div>;

  const title = "Detail Orderan Fleets";
  const description = "Detail lengkap transaksi orderan sewa kendaraan";
  const discount = data.price_calculation?.discount_percentage ?? 0;

  // Additional services dari field additional_services (array of {description, price})
  const additionalServices: { description: string; price: number }[] = Array.isArray(data.additional_services)
    ? data.additional_services
    : [];
  const additionalServicesTotal = additionalServices.reduce(
    (sum, item) => sum + (Number(item?.price) || 0),
    0,
  );

  // Addons price dari field addons_price di root
  const addonsPrice = Number(data.addons_price ?? data.price_calculation?.addons_price ?? 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />

      <div className="space-y-8 w-full pt-4">
        {/* Row 1 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Nama Customer</Label>
            <Input disabled value={data.customer?.name || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Armada</Label>
            <Input disabled value={data.fleet?.name || "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Tanggal Sewa</Label>
            <Input disabled value={formatDate(data.start_date) || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Harga Unit</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.rent_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Durasi Penyewaan</Label>
            <Input disabled value={data.duration ? `${data.duration} Hari` : "-"} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total Harga Unit</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.total_rent_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Discount</Label>
            <Input disabled value={`${discount}%`} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total Potongan Diskon Unit</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.discount ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total Harga Setelah Diskon</Label>
            <Input
              disabled
              value={formatRupiah(
                (data.price_calculation?.total_rent_price ?? 0) - (data.price_calculation?.discount ?? 0),
              )}
              className="disabled:opacity-90 mt-2"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Charge Weekend</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.total_weekend_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Layanan Antar Jemput</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.service_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Layanan Luar Kota</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.out_of_town_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 5 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Layanan Driver</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.total_driver_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Layanan Asuransi</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.insurance_price ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Layanan Add-Ons</Label>
            <Input disabled value={formatRupiah(addonsPrice)} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Row 6 */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div>
            <Label>Layanan Lainnya (Total)</Label>
            <Input disabled value={formatRupiah(additionalServicesTotal)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>Total Harga Keseluruhan</Label>
            <Input disabled value={formatRupiah(data.price_calculation?.grand_total ?? 0)} className="disabled:opacity-90 mt-2" />
          </div>
          <div>
            <Label>No Invoice</Label>
            <Input disabled value={data.invoice_number || "-"} className="disabled:opacity-90 mt-2" />
          </div>
        </div>

        {/* Layanan Lainnya Detail */}
        {additionalServices.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Detail Layanan Lainnya</Label>
            <div className="border rounded-md divide-y">
              {additionalServices.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm font-medium">{item.description || `Item ${idx + 1}`}</span>
                  <span className="text-sm font-semibold">{formatRupiah(Number(item.price) || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-3 bg-muted/30">
                <span className="text-sm font-semibold">Total Layanan Lainnya</span>
                <span className="text-sm font-semibold">{formatRupiah(additionalServicesTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Row 7: Status */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <Label>Status</Label>
            <div className="mt-2">
              {data.status === "accepted" ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 w-full h-10 flex items-center justify-center text-lg font-semibold tracking-widest">
                  Lunas
                </Badge>
              ) : (
                <Input disabled value={data.status ?? "-"} className="disabled:opacity-90" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


