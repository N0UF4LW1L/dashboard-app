"use client";

import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, RefreshCw, ArrowUpDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlanningCashFlow, useGetDetailPlanning } from "@/hooks/api/use-planning";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function PlanningArusKasPage() {
  const params = useParams();
  const planningId = params.planningId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: dayjs().startOf("year").toDate(),
    to: dayjs().endOf("year").toDate(),
  });
  const [activeTab, setActiveTab] = useState("data");

  const { data: planningData } = useGetDetailPlanning(planningId);
  const { data, isLoading, error, refetch } = useGetPlanningCashFlow(planningId, {
    startDate: dateRange.from ? dayjs(dateRange.from).format("YYYY-MM-DD") : undefined,
    endDate: dateRange.to ? dayjs(dateRange.to).format("YYYY-MM-DD") : undefined,
  });

  const planning = planningData?.data;
  const breadcrumbItems = [
    { title: "Perencanaan", link: "/dashboard/perencanaan" },
    { title: planning?.name || "Detail", link: `/dashboard/perencanaan/${planningId}` },
    { title: "Arus Kas", link: "#" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const operating = data?.operating_activities || [];
  const investing = data?.investing_activities || [];
  const financing = data?.financing_activities || [];
  const netCashFlow = data?.net_cash_flow || 0;

  const renderSection = (title: string, items: any[], color: string) => (
    <>
      <tr className={`${color} border-b border-gray-200`}>
        <td colSpan={3} className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-center">{title}</td>
      </tr>
      {items.length === 0 ? (
        <tr className="bg-white border-b border-gray-200"><td colSpan={3} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-500 italic border-r border-gray-300">Belum ada data</td></tr>
      ) : items.map((item: any, i: number) => (
        <tr key={i} className="bg-white hover:bg-gray-50 border-b border-gray-200">
          <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
          <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
          <td className={`py-2 px-2 sm:px-4 text-xs sm:text-sm text-right font-medium whitespace-nowrap ${item.running_balance >= 0 ? "text-green-700" : "text-red-600"}`}>
            {formatCurrency(item.running_balance)}
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Laporan Arus Kas" description={`Perencanaan: ${planning?.name || ""}`} />
        </div>
        <Separator />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-6 w-6" />
                Arus Kas Perencanaan
              </CardTitle>
              {dateRange.from && dateRange.to && (
                <p className="text-sm text-gray-600 mt-1">
                  Periode: {dayjs(dateRange.from).format('DD/MM/YYYY')} - {dayjs(dateRange.to).format('DD/MM/YYYY')}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="data">Data Laporan</TabsTrigger>
                  <TabsTrigger value="rumus">Rumus</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Cari berdasarkan nama akun..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="min-w-[260px]">
                      <CalendarDateRangePicker
                        dateRange={dateRange}
                        onDateRangeChange={(r) => r && setDateRange(r)}
                        onClearDate={() => setDateRange({ from: dayjs().startOf("month").toDate(), to: dayjs().endOf("month").toDate() })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="min-w-[120px]">
                        <Download className="h-4 w-4 mr-2" /> Excel
                      </Button>
                      <Button variant="outline" size="sm" className="min-w-[120px]">
                        <Download className="h-4 w-4 mr-2" /> CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm">No Akun</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm">Nama Akun</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700 text-xs sm:text-sm w-44">Jumlah</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan={3} className="py-12 text-center text-gray-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />Loading...</td></tr>
                          ) : (
                            <>
                              {renderSection("ARUS KAS DARI AKTIVITAS OPERASI", operating, "bg-gray-100")}
                              <tr><td colSpan={3} className="py-1 sm:py-2" /></tr>
                              {renderSection("ARUS KAS DARI AKTIVITAS INVESTASI", investing, "bg-gray-100")}
                              <tr><td colSpan={3} className="py-1 sm:py-2" /></tr>
                              {renderSection("ARUS KAS DARI AKTIVITAS PENDANAAN", financing, "bg-gray-100")}
                              <tr><td colSpan={3} className="py-1 sm:py-2" /></tr>
                              <tr className="bg-gray-100 border-t-2 border-gray-400 border-b">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-900 text-center border-r border-gray-300" colSpan={2}>NET CASH FLOW</td>
                                <td className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-right whitespace-nowrap ${netCashFlow >= 0 ? "text-blue-900" : "text-red-900"}`}>
                                  {formatCurrency(netCashFlow)}
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rumus" className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">RUMUS ARUS KAS PERENCANAAN</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-900 mb-4">NET CASH FLOW = Operasional + Investasi + Pendanaan</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Operasional:</strong> Perubahan akun Aset Lancar, Kewajiban Lancar, Pendapatan, dan Beban.</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Investasi:</strong> Perubahan akun Aset Tetap.</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Pendanaan:</strong> Perubahan akun Kewajiban Jangka Panjang dan Modal.</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-800"><strong>Catatan:</strong> Akun Kas (1110) tidak dimasukkan ke dalam kategori manapun karena merupakan objek yang dihitung.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
