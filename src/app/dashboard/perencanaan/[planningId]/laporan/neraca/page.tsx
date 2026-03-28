"use client";

import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Scale } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlanningBalanceSheet, useGetDetailPlanning } from "@/hooks/api/use-planning";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function PlanningNeracaPage() {
  const params = useParams();
  const planningId = params.planningId as string;
  const [asOfDate, setAsOfDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("data");

  const { data: planningData } = useGetDetailPlanning(planningId);
  const { data, isLoading, error, refetch } = useGetPlanningBalanceSheet(planningId, {
    asOfDate: asOfDate || undefined,
  });

  const planning = planningData?.data;
  const breadcrumbItems = [
    { title: "Perencanaan", link: "/dashboard/perencanaan" },
    { title: planning?.name || "Detail", link: `/dashboard/perencanaan/${planningId}` },
    { title: "Neraca", link: "#" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const assets = data?.assets || {};
  const liabilities = data?.liabilities || {};
  const equity = data?.equity || {};
  const totalA = data?.assets?.total_assets || 0;
  const totalLE = data?.total_liabilities_equity || 0;

  const allAssets = [...(assets.current_assets || []), ...(assets.fixed_assets || [])];
  const allLiabilities = [...(liabilities.current_liabilities || []), ...(liabilities.long_term_liabilities || [])];
  const equityAccounts = equity.accounts || [];

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Laporan Neraca" description={`Perencanaan: ${planning?.name || ""}`} />
        </div>
        <Separator />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-6 w-6" />
                Neraca Perencanaan
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Per Tanggal: {dayjs(asOfDate).format('DD MMMM YYYY')}</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="data" className="w-full" onValueChange={setActiveTab}>
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
                    <div className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={asOfDate}
                        onChange={(e) => setAsOfDate(e.target.value)}
                        className="w-44"
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* AKTIVA */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-4 text-sm font-bold text-gray-900 text-center" colSpan={2}>AKTIVA (HARTA)</th>
                          </tr>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">Akun</th>
                            <th className="text-right py-2 px-4 text-xs font-semibold text-gray-600 uppercase">Jumlah (RP)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan={2} className="py-12 text-center text-gray-400">Loading...</td></tr>
                          ) : allAssets.length === 0 ? (
                            <tr><td colSpan={2} className="py-4 px-4 text-sm text-gray-400 italic">Belum ada data</td></tr>
                          ) : allAssets.map((item: any) => (
                            <tr key={item.account_id} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                              <td className="py-2 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code} - {item.account_name}</td>
                              <td className="py-2 px-4 text-xs sm:text-sm text-right font-medium whitespace-nowrap">{formatCurrency(item.running_balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 border-t-2 border-gray-400">
                            <td className="py-2 px-4 text-sm font-bold text-gray-900">Total Aktiva</td>
                            <td className="py-2 px-4 text-sm font-bold text-gray-900 text-right">{formatCurrency(totalA)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* PASIVA */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-4 text-sm font-bold text-gray-900 text-center" colSpan={2}>PASIVA (KEWAJIBAN + MODAL)</th>
                          </tr>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-2 px-4 text-xs font-semibold text-gray-600 uppercase border-r border-gray-300">Akun</th>
                            <th className="text-right py-2 px-4 text-xs font-semibold text-gray-600 uppercase">Jumlah (RP)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan={2} className="py-12 text-center text-gray-400">Loading...</td></tr>
                          ) : (
                            <>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <td colSpan={2} className="py-1 px-4 text-[10px] font-bold text-gray-500 uppercase">Kewajiban</td>
                              </tr>
                              {allLiabilities.map((item: any) => (
                                <tr key={item.account_id} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                  <td className="py-2 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code} - {item.account_name}</td>
                                  <td className="py-2 px-4 text-xs sm:text-sm text-right font-medium whitespace-nowrap">{formatCurrency(item.running_balance)}</td>
                                </tr>
                              ))}
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <td colSpan={2} className="py-1 px-4 text-[10px] font-bold text-gray-500 uppercase">Modal</td>
                              </tr>
                              {equityAccounts.map((item: any) => (
                                <tr key={item.account_id} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                  <td className="py-2 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code} - {item.account_name}</td>
                                  <td className="py-2 px-4 text-xs sm:text-sm text-right font-medium whitespace-nowrap">{formatCurrency(item.running_balance)}</td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 border-t-2 border-gray-400">
                            <td className="py-2 px-4 text-sm font-bold text-gray-900">Total Pasiva</td>
                            <td className="py-2 px-4 text-sm font-bold text-gray-900 text-right">{formatCurrency(totalLE)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Balance Check */}
                  {!isLoading && (
                    <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${Math.abs(totalA - totalLE) < 1 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {Math.abs(totalA - totalLE) < 1
                        ? "✅ Neraca seimbang: Total Aktiva = Total Pasiva"
                        : `⚠️ Neraca tidak seimbang. Selisih: ${formatCurrency(Math.abs(totalA - totalLE))}`}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rumus" className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">RUMUS NERACA PERENCANAAN</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-900 mb-4">AKTIVA = PASIVA</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Aktiva (Harta):</strong> Semua akun tipe ASSET (Current Assets & Fixed Assets).</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Kewajiban (Hutang):</strong> Semua akun tipe LIABILITY.</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Modal (Equity):</strong> Semua akun tipe EQUITY + Laba/Rugi Tahun Berjalan.</p>
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

