"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, RefreshCw, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlanningProfitLoss, useGetDetailPlanning } from "@/hooks/api/use-planning";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useState } from "react";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";

export default function PlanningLabaRugiPage() {
  const params = useParams();
  const planningId = params.planningId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: dayjs().startOf("year").toDate(),
    to: dayjs().endOf("year").toDate(),
  });
  const [activeTab, setActiveTab] = useState("data");

  const { data: planningData } = useGetDetailPlanning(planningId);
  const { data, isLoading, error, refetch } = useGetPlanningProfitLoss(planningId, {
    startDate: dateRange.from ? dayjs(dateRange.from).format("YYYY-MM-DD") : undefined,
    endDate: dateRange.to ? dayjs(dateRange.to).format("YYYY-MM-DD") : undefined,
  });

  const planning = planningData?.data;
  const breadcrumbItems = [
    { title: "Perencanaan", link: "/dashboard/perencanaan" },
    { title: planning?.name || "Detail", link: `/dashboard/perencanaan/${planningId}` },
    { title: "Laba Rugi", link: "#" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error) return (
    <div className="flex-1 p-8">
      <Card><CardContent className="p-6 text-center text-red-600">Error: {(error as any).message}</CardContent></Card>
    </div>
  );

  const revenue = data?.revenue?.accounts || [];
  const expenses = data?.expenses?.accounts || [];
  const totalRevenue = data?.revenue?.total_revenue || 0;
  const totalExpenses = data?.expenses?.total_expenses || 0;
  const netProfit = data?.net_profit || 0;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Laporan Laba Rugi" description={`Perencanaan: ${planning?.name || ""}`} />
        </div>
        <Separator />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Laba Rugi Perencanaan
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
                            <th className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm" rowSpan={2}>No Akun</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm" rowSpan={2}>Nama Akun</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm" colSpan={2}>Perencanaan</th>
                          </tr>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-right py-2 px-4 font-medium text-gray-600 border-r border-gray-300 text-xs sm:text-sm">RP</th>
                            <th className="text-right py-2 px-4 font-medium text-gray-600 text-xs sm:text-sm">RP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan={4} className="py-12 text-center text-gray-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />Loading...</td></tr>
                          ) : (
                            <>
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-center" colSpan={4}>PENDAPATAN</td>
                              </tr>
                              {revenue.length === 0 ? (
                                <tr className="bg-white border-b border-gray-200"><td colSpan={4} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-500 italic border-r border-gray-300">Belum ada data pendapatan</td></tr>
                              ) : revenue.map((item: any, idx: number) => (
                                <tr key={`rev-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">{formatCurrency(item.running_balance)}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right">-</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-center border-r border-gray-300" colSpan={3}>TOTAL PENDAPATAN</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(totalRevenue)}</td>
                              </tr>

                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-center" colSpan={4}>BEBAN</td>
                              </tr>
                              {expenses.length === 0 ? (
                                <tr className="bg-white border-b border-gray-200"><td colSpan={4} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-500 italic border-r border-gray-300" >Belum ada data beban</td></tr>
                              ) : expenses.map((item: any, idx: number) => (
                                <tr key={`exp-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">-</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{formatCurrency(item.running_balance)}</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-center border-r border-gray-300" colSpan={3}>TOTAL BEBAN</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(totalExpenses)}</td>
                              </tr>

                              <tr className="bg-gray-100 border-t-2 border-gray-400 border-b ">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-900 text-center border-r border-gray-300" colSpan={3}>LABA BERSIH</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-900 text-right whitespace-nowrap">{formatCurrency(netProfit)}</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rumus" className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">RUMUS LABA RUGI PERENCANAAN</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-900 mb-4">LABA BERSIH = Total Pendapatan - Total Beban</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border"><p className="text-sm text-gray-700"><strong>Pendapatan:</strong> Semua akun tipe REVENUE di perencanaan</p></div>
                      <div className="bg-white p-3 rounded border"><p className="text-sm text-gray-700"><strong>Beban:</strong> Semua akun tipe EXPENSE di perencanaan</p></div>
                      <div className="bg-blue-50 p-3 rounded border border-blue-200"><p className="text-sm text-blue-800"><strong>Catatan:</strong> Data ini dihitung dari tab Rencana.</p></div>
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
