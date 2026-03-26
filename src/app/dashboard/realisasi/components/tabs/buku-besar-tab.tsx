"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Download, Search, BookOpen } from "lucide-react";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import { TabType } from "../../hooks/use-tab-state";
import { useDebounce } from "../../hooks/use-debounce";
import { useGetGeneralLedger } from "@/hooks/api/useFinancialReports";
import { useGetLocations } from "@/hooks/api/use-location";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BukuBesarTabProps {
  registerRefetchCallback: (tab: TabType, callback: () => void) => void;
}

export default function BukuBesarTab({ registerRefetchCallback }: BukuBesarTabProps) {
  const router = useRouter();
  
  // Date State
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    return {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    };
  });
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const { data: locationsData } = useGetLocations({ page: 1, limit: 100 }) as any;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Tab State
  const [activeInnerTab, setActiveInnerTab] = useState("data-laporan");

  // API Call
  const { data: generalLedgerData, isLoading, refetch } = useGetGeneralLedger({
    startDate: dateRange.from ? dayjs(dateRange.from).format('YYYY-MM-DD') : dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dateRange.to ? dayjs(dateRange.to).format('YYYY-MM-DD') : dayjs().endOf('month').format('YYYY-MM-DD'),
  });

  // Register refetch
  useEffect(() => {
    registerRefetchCallback("buku-besar", refetch);
  }, [registerRefetchCallback, refetch]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  // Filter accounts client-side
  const filteredData = useMemo(() => {
    if (!generalLedgerData) return [];
    
    return generalLedgerData.filter((acc: any) => {
      const matchSearch = debouncedSearchQuery 
        ? acc.account_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
          acc.account_code.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        : true;
        
      return matchSearch;
    });
  }, [generalLedgerData, debouncedSearchQuery]);

  // Summaries
  const totalAkun = filteredData.length;
  const totalDebit = filteredData.reduce((acc: number, curr: any) => acc + curr.total_debit, 0);
  const totalKredit = filteredData.reduce((acc: number, curr: any) => acc + curr.total_credit, 0);

  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl font-bold">Buku Besar Realisasi</CardTitle>
          </div>
          <CardDescription>
            Periode: {dateRange.from ? dayjs(dateRange.from).format('DD/MM/YYYY') : '-'} - {dateRange.to ? dayjs(dateRange.to).format('DD/MM/YYYY') : '-'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeInnerTab} onValueChange={setActiveInnerTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="data-laporan">Data Laporan</TabsTrigger>
              <TabsTrigger value="rumus">Rumus</TabsTrigger>
            </TabsList>

            <TabsContent value="data-laporan" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari berdasarkan nama akun atau kode akun..."
                      className="pl-8 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-[300px]">
                    <CalendarDateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} onClearDate={() => handleDateRangeChange(undefined)} />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Excel
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> CSV
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-medium">Tipe Kendaraan</Label>
                    <Select defaultValue="semua">
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Tipe</SelectItem>
                        <SelectItem value="mobil">Mobil</SelectItem>
                        <SelectItem value="motor">Motor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-medium">Cabang/Lokasi</Label>
                    <Select defaultValue="semua">
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Lokasi</SelectItem>
                        {locationsData?.items?.map((loc: any) => (
                           <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <Card className="shadow-none border border-slate-200">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <span className="text-sm text-slate-500 font-medium mb-1">Total Akun</span>
                    <span className="text-2xl font-bold text-blue-600">{totalAkun}</span>
                  </CardContent>
                </Card>
                <Card className="shadow-none border border-slate-200">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <span className="text-sm text-slate-500 font-medium mb-1">Total Debit</span>
                    <span className="text-2xl font-bold text-green-600">{formatRupiah(totalDebit)}</span>
                  </CardContent>
                </Card>
                <Card className="shadow-none border border-slate-200">
                  <CardContent className="p-4 flex flex-col justify-center">
                    <span className="text-sm text-slate-500 font-medium mb-1">Total Kredit</span>
                    <span className="text-2xl font-bold text-red-600">{formatRupiah(totalKredit)}</span>
                  </CardContent>
                </Card>
              </div>

              {/* Table */}
              <div className="rounded-md border bg-white mt-4">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">No Akun</TableHead>
                      <TableHead className="font-semibold text-slate-700">Nama Akun</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tipe</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Saldo Awal</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Total Debit</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Total Kredit</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Saldo Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Memuat data buku besar...
                        </TableCell>
                      </TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada data transaksi akun pada periode ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row: any) => (
                        <TableRow 
                          key={row.account_id}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => router.push(`/dashboard/realisasi/akun/${row.account_id}?start_date=${dayjs(dateRange.from).format('YYYY-MM-DD')}&end_date=${dayjs(dateRange.to).format('YYYY-MM-DD')}`)}
                        >
                          <TableCell className="font-medium text-slate-700">{row.account_code}</TableCell>
                          <TableCell>{row.account_name}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                              {row.account_type}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{formatRupiah(row.initial_balance)}</TableCell>
                          <TableCell className="text-right">{row.total_debit === 0 ? '-' : formatRupiah(row.total_debit)}</TableCell>
                          <TableCell className="text-right">{row.total_credit === 0 ? '-' : formatRupiah(row.total_credit)}</TableCell>
                          <TableCell className="text-right font-medium text-slate-900">{formatRupiah(row.final_balance)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="rumus" className="space-y-4">
              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-sm font-bold uppercase mb-4 text-slate-800">RUMUS BUKU BESAR</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded">
                    <p className="font-bold text-slate-800">SALDO AKHIR = Saldo Awal + Total Debit - Total Kredit</p>
                  </div>
                  <div className="p-4 bg-white border rounded">
                    <p><span className="font-semibold text-slate-700">Saldo Awal:</span> Saldo akun pada awal periode yang dipilih</p>
                  </div>
                  <div className="p-4 bg-white border rounded">
                    <p><span className="font-semibold text-slate-700">Total Debit:</span> Jumlah semua transaksi debit pada periode yang dipilih</p>
                  </div>
                  <div className="p-4 bg-white border rounded">
                    <p><span className="font-semibold text-slate-700">Total Kredit:</span> Jumlah semua transaksi kredit pada periode yang dipilih</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded text-blue-800">
                    <p><strong>Catatan:</strong> Klik pada baris akun tabel untuk melihat detail transaksi per akun. Data diambil berdasarkan perode yang dipilih, dan semua akun akan selalu ditunjukkan secara default.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
