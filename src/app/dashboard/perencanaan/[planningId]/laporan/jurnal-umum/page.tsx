"use client";

import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, RefreshCw, BookOpen } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetPlanningJournal, useGetDetailPlanning } from "@/hooks/api/use-planning";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function PlanningJurnalUmumPage() {
  const params = useParams();
  const planningId = params.planningId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: dayjs().startOf("year").toDate(),
    to: dayjs().endOf("year").toDate(),
  });
  const [activeTab, setActiveTab] = useState("data");

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'csv') => {
    if (!entries.length) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    setIsExporting(true);
    try {
      const exportData: any[] = [];
      exportData.push({ 'Tanggal': 'Tanggal', 'Keterangan / Akun': 'Keterangan / Akun', 'Debit': 'Debit', 'Kredit': 'Kredit' });

      entries.forEach((entry: any) => {
        // Debit row
        exportData.push({
          'Tanggal': dayjs(entry.date).format("DD/MM/YYYY"),
          'Keterangan / Akun': entry.debit_account ? `${entry.debit_account.code} - ${entry.debit_account.name}` : '–',
          'Debit': entry.amount,
          'Kredit': 0
        });
        // Credit row
        exportData.push({
          'Tanggal': '',
          'Keterangan / Akun': entry.credit_account ? `    ${entry.credit_account.code} - ${entry.credit_account.name}` : '    –',
          'Debit': 0,
          'Kredit': entry.amount
        });
      });

      const filename = `jurnal_umum_perencanaan_${planning?.name || planningId}_${dayjs().format('YYYY-MM-DD')}`;
      
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jurnal Umum");
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
  const { data, isLoading, error, refetch } = useGetPlanningJournal(planningId, {
    date_from: dateRange.from ? dayjs(dateRange.from).format("YYYY-MM-DD") : undefined,
    date_to: dateRange.to ? dayjs(dateRange.to).format("YYYY-MM-DD") : undefined,
    limit: 200,
  });

  const planning = planningData?.data;
  const breadcrumbItems = [
    { title: "Perencanaan", link: "/dashboard/perencanaan" },
    { title: planning?.name || "Detail", link: `/dashboard/perencanaan/${planningId}` },
    { title: "Jurnal Umum", link: "#" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const entries: any[] = data?.items || [];
  const totalAmount = entries.reduce((s: number, e: any) => s + Number(e.amount), 0);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Laporan Jurnal Umum" description={`Perencanaan: ${planning?.name || ""}`} />
        </div>
        <Separator />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Jurnal Umum Perencanaan
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
                  <TabsTrigger value="data">Data Jurnal</TabsTrigger>
                  <TabsTrigger value="rumus">Rumus</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[300px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Cari keterangan atau akun..."
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
                      <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-300 text-xs sm:text-sm w-32">Tanggal</th>
                            <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-300 text-xs sm:text-sm">Keterangan / Akun</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-700 border-r border-gray-300 text-xs sm:text-sm w-44">Debit</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-700 text-xs sm:text-sm w-44">Kredit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr><td colSpan={4} className="py-12 text-center text-gray-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />Loading...</td></tr>
                          ) : entries.length === 0 ? (
                            <tr><td colSpan={4} className="py-4 px-4 text-sm text-gray-400 italic text-center">Belum ada data jurnal</td></tr>
                          ) : (
                            entries.flatMap((entry: any, index: number) => [
                              <tr key={`${entry.id}-debit`} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-2 px-4 text-xs sm:text-sm text-gray-700 border-r border-gray-300" rowSpan={2}>{dayjs(entry.date).format("DD/MM/YYYY")}</td>
                                <td className="py-2 px-4 text-xs sm:text-sm text-gray-900 font-semibold border-r border-gray-300 capitalize">
                                  {entry.debit_account ? `${entry.debit_account.code} - ${entry.debit_account.name}` : "–"}
                                </td>
                                <td className="py-2 px-4 text-xs sm:text-sm text-green-700 font-bold text-right border-r border-gray-300 whitespace-nowrap">{formatCurrency(entry.amount)}</td>
                                <td className="py-2 px-4 text-xs sm:text-sm text-gray-300 text-right whitespace-nowrap">Rp 0</td>
                              </tr>,
                              <tr key={`${entry.id}-credit`} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 pl-12 text-xs sm:text-sm text-gray-700 border-r border-gray-300 italic">
                                  {entry.credit_account ? `${entry.credit_account.code} - ${entry.credit_account.name}` : "–"}
                                </td>
                                <td className="py-2 px-4 text-xs sm:text-sm text-gray-300 text-right border-r border-gray-300 whitespace-nowrap">Rp 0</td>
                                <td className="py-2 px-4 text-xs sm:text-sm text-blue-700 font-bold text-right whitespace-nowrap">{formatCurrency(entry.amount)}</td>
                              </tr>
                            ])
                          )}
                        </tbody>
                        {entries.length > 0 && (
                          <tfoot>
                            <tr className="bg-gray-100 border-t-2 border-gray-400">
                              <td colSpan={2} className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-gray-900 text-center border-r border-gray-300">TOTAL JURNAL</td>
                              <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-green-700 text-right border-r border-gray-300 whitespace-nowrap">
                                {formatCurrency(totalAmount)}
                              </td>
                              <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold text-blue-700 text-right whitespace-nowrap">
                                {formatCurrency(totalAmount)}
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rumus" className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">RUMUS JURNAL UMUM PERENCANAAN</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-900 mb-4">DEBIT = KREDIT</p>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700">Setiap transaksi perencanaan dicatat dalam format Jurnal Berpasangan (Double-Entry Bookkeeping).</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Debit:</strong> Penambahan Aset/Beban atau Pengurangan Kewajiban/Modal/Pendapatan.</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm text-gray-700"><strong>Kredit:</strong> Pengurangan Aset/Beban atau Penambahan Kewajiban/Modal/Pendapatan.</p>
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
