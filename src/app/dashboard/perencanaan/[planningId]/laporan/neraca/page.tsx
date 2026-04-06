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

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'csv') => {
    if (!data) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    setIsExporting(true);
    try {
      const exportData = [];
      exportData.push({ 'No Akun': 'No Akun', 'Nama Akun': 'Nama Akun', 'Debit': 'Debit', 'Kredit': 'Kredit' });

      // AKTIVA
      exportData.push({ 'No Akun': '', 'Nama Akun': 'AKTIVA', 'Debit': '', 'Kredit': '' });
      allAssets.forEach((item: any) => {
        exportData.push({
          'No Akun': item.account_code,
          'Nama Akun': item.account_name,
          'Debit': item.running_balance > 0 ? item.running_balance : 0,
          'Kredit': item.running_balance < 0 ? Math.abs(item.running_balance) : 0
        });
      });
      exportData.push({ 'No Akun': '', 'Nama Akun': 'TOTAL AKTIVA', 'Debit': totalA, 'Kredit': 0 });

      // Empty
      exportData.push({ 'No Akun': '', 'Nama Akun': '', 'Debit': '', 'Kredit': '' });

      // PASIVA
      exportData.push({ 'No Akun': '', 'Nama Akun': 'PASIVA', 'Debit': '', 'Kredit': '' });
      allLiabilities.forEach((item: any) => {
        exportData.push({
          'No Akun': item.account_code,
          'Nama Akun': item.account_name,
          'Debit': item.running_balance < 0 ? Math.abs(item.running_balance) : 0,
          'Kredit': item.running_balance > 0 ? item.running_balance : 0
        });
      });
      equityAccounts.forEach((item: any) => {
        exportData.push({
          'No Akun': item.account_code,
          'Nama Akun': item.account_name,
          'Debit': item.running_balance < 0 ? Math.abs(item.running_balance) : 0,
          'Kredit': item.running_balance > 0 ? item.running_balance : 0
        });
      });
      exportData.push({ 'No Akun': '', 'Nama Akun': 'TOTAL PASIVA', 'Debit': 0, 'Kredit': totalLE });

      const filename = `neraca_perencanaan_${planning?.name || planningId}_${dayjs().format('YYYY-MM-DD')}`;
      
      if (format === 'csv') {
        const csvContent = convertToCSV(exportData);
        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
      } else {
        const excelContent = convertToExcel(exportData);
        downloadFile(excelContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', true);
      }
      toast.success(`Data berhasil diekspor dalam format ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(','));
    return [csvHeaders, ...csvRows].join('\n');
  };

  const convertToExcel = (data: any[]) => {
    const XLSX = require('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Neraca");
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  };

  const downloadFile = (content: any, filename: string, mimeType: string, isExcel: boolean = false) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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
                      <Button onClick={() => handleExport('excel')} variant="outline" size="sm" className="min-w-[120px]" disabled={isExporting}>
                        <Download className="h-4 w-4 mr-2" /> Excel
                      </Button>
                      <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="min-w-[120px]" disabled={isExporting}>
                        <Download className="h-4 w-4 mr-2" /> CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm">
                              No Akun
                            </th>
                            <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm">
                              Nama Akun
                            </th>
                            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 border-r border-gray-300 text-xs sm:text-sm">
                              Debit
                            </th>
                            <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">
                              Kredit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr>
                              <td colSpan={4} className="px-2 sm:px-4 py-8 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                Loading data neraca...
                              </td>
                            </tr>
                          ) : data ? (
                            <>
                              {/* AKTIVA Section */}
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900" colSpan={4}>AKTIVA</td>
                              </tr>
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-800" colSpan={4}>AKTIVA LANCAR</td>
                              </tr>
                              {allAssets.filter(a => a.account_type === 'ASSETS' && a.account_code?.startsWith('11')).length > 0 ? (
                                allAssets.filter(a => a.account_type === 'ASSETS' && a.account_code?.startsWith('11')).map((item: any, idx: number) => (
                                  <tr key={`ca-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">{item.running_balance > 0 ? formatCurrency(item.running_balance) : '-'}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.running_balance < 0 ? formatCurrency(Math.abs(item.running_balance)) : '-'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white border-b border-gray-200"><td colSpan={4} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-400 italic">Belum ada data aktiva lancar</td></tr>
                              )}

                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-800" colSpan={4}>AKTIVA TETAP</td>
                              </tr>
                              {allAssets.filter(a => a.account_type === 'ASSETS' && (a.account_code?.startsWith('12') || a.account_code?.startsWith('13'))).length > 0 ? (
                                allAssets.filter(a => a.account_type === 'ASSETS' && (a.account_code?.startsWith('12') || a.account_code?.startsWith('13'))).map((item: any, idx: number) => (
                                  <tr key={`fa-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">{item.running_balance > 0 ? formatCurrency(item.running_balance) : '-'}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.running_balance < 0 ? formatCurrency(Math.abs(item.running_balance)) : '-'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white border-b border-gray-200"><td colSpan={4} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-400 italic">Belum ada data aktiva tetap</td></tr>
                              )}

                              <tr className="bg-gray-100 border-t-2 border-gray-400 border-b">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-300" colSpan={2}>TOTAL AKTIVA</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right border-r border-gray-300 whitespace-nowrap">{formatCurrency(totalA)}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">-</td>
                              </tr>

                              <tr><td className="py-2" colSpan={4}></td></tr>

                              {/* PASIVA Section */}
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900" colSpan={4}>PASIVA</td>
                              </tr>
                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-800" colSpan={4}>KEWAJIBAN</td>
                              </tr>
                              {allLiabilities.length > 0 ? (
                                allLiabilities.map((item: any, idx: number) => (
                                  <tr key={`li-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">{item.running_balance < 0 ? formatCurrency(Math.abs(item.running_balance)) : '-'}</td>
                                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.running_balance > 0 ? formatCurrency(item.running_balance) : '-'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr className="bg-white border-b border-gray-200"><td colSpan={4} className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-400 italic">Belum ada data kewajiban</td></tr>
                              )}

                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-800" colSpan={4}>EKUITAS</td>
                              </tr>
                              {equityAccounts.map((item: any, idx: number) => (
                                <tr key={`eq-${idx}`} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_code}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300">{item.account_name}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right border-r border-gray-300 whitespace-nowrap">{item.running_balance < 0 ? formatCurrency(Math.abs(item.running_balance)) : '-'}</td>
                                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 text-right whitespace-nowrap">{item.running_balance > 0 ? formatCurrency(item.running_balance) : '-'}</td>
                                </tr>
                              ))}

                              <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-300" colSpan={2}>TOTAL PASIVA (KEWAJIBAN + EKUITAS)</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right border-r border-gray-300 whitespace-nowrap">-</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{formatCurrency(totalLE)}</td>
                              </tr>

                              <tr className="bg-blue-50 border-t-2 border-blue-400">
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-blue-900 border-r border-blue-300" colSpan={2}>BALANCE CHECK</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-blue-900 text-right border-r border-blue-300 whitespace-nowrap">{formatCurrency(totalA)}</td>
                                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-blue-900 text-right whitespace-nowrap">{formatCurrency(totalLE)}</td>
                              </tr>
                            </>
                          ) : (
                            <tr><td colSpan={4} className="py-12 text-center text-gray-500">Tidak ada data neraca</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Balance Status */}
                  {!isLoading && data && (
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

