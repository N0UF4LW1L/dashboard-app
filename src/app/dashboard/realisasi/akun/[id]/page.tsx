"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import { useGetAccountById, useGetFinancialTransactions } from "@/hooks/api/useRealization";
import { formatRupiah } from "@/lib/utils";
import BreadCrumb from "@/components/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DetailAkunPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const accountId = params.id as string;
  
  // Date State from URL params
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startDateParam ? dayjs(startDateParam).toDate() : dayjs().startOf('month').toDate(),
    to: endDateParam ? dayjs(endDateParam).toDate() : dayjs().endOf('month').toDate(),
  });

  const { data: accountData, isLoading: accountLoading } = useGetAccountById(accountId);
  
  const formattedStartDate = dateRange.from ? dayjs(dateRange.from).format('YYYY-MM-DD') : undefined;
  const formattedEndDate = dateRange.to ? dayjs(dateRange.to).format('YYYY-MM-DD') : undefined;

  const { data: transactionsData, isLoading: transactionsLoading } = useGetFinancialTransactions({
    account_id: accountId,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
    limit: 1000
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const breadcrumbItems = [
    { title: "Realisasi", link: "/dashboard/realisasi?tab=buku-besar" },
    { title: "Buku Besar", link: "/dashboard/realisasi?tab=buku-besar" },
    { title: accountData?.name || "Detail Akun", link: `/dashboard/realisasi/akun/${accountId}` }
  ];

  // Calculate Summary metrics
  // Dalam real-world kita mungkin mendapatkan ini langsung dari backend (e.g. general ledger summary)
  // Untuk di sini kita kalkulasikan dari transaksi entry yang ter-ambil
  const txItems = transactionsData?.items || [];
  
  // Filter and flatten entries matching this account specifically
  const flatEntries = txItems.flatMap((tx: any) => {
    return (tx.entries || [])
      .filter((entry: any) => entry.account_id === accountId)
      .map((entry: any) => ({
        ...entry,
        transaction_date: tx.transaction_date,
        reference_number: tx.reference_number,
        transaction_description: tx.description
      }));
  }).sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());

  const totalDebit = flatEntries.filter((e: any) => e.entry_type === 'DEBIT').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalKredit = flatEntries.filter((e: any) => e.entry_type === 'CREDIT').reduce((acc: number, curr: any) => acc + curr.amount, 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      
      <div className="flex flex-col gap-4">
        {/* Filter Section */}
        <Card className="border shadow-none mb-2">
          <CardContent className="p-4">
            <Label className="text-sm font-semibold text-slate-900 mb-4 block">Filter Tanggal</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Dari Tanggal</Label>
                <div className="relative">
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Pilih tanggal mulai"
                    value={formattedStartDate || ''}
                    onChange={(e) => {
                      const newRange = { ...dateRange, from: e.target.value ? dayjs(e.target.value).toDate() : undefined };
                      handleDateRangeChange(newRange as DateRange);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Sampai Tanggal</Label>
                <div className="relative">
                  <input
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Pilih tanggal akhir"
                    value={formattedEndDate || ''}
                    onChange={(e) => {
                      const newRange = { ...dateRange, to: e.target.value ? dayjs(e.target.value).toDate() : undefined };
                      handleDateRangeChange(newRange as DateRange);
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Section */}
        {accountLoading ? (
            <div className="h-24 animate-pulse bg-slate-100 rounded-md mb-2"></div>
        ) : (
          <Card className="border shadow-none mb-2">
            <CardContent className="p-4">
              <h1 className="text-base font-bold text-slate-900">{accountData?.name || '-'}</h1>
              <p className="text-xs text-blue-600 mt-1 font-medium">Kode: {accountData?.code || '-'}</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <Card className="border shadow-none">
            <CardContent className="p-4">
              <span className="text-xs font-medium text-slate-500 mb-2 block">Total Debit</span>
              <span className="text-lg font-bold text-green-600">{formatRupiah(totalDebit)}</span>
            </CardContent>
          </Card>
          <Card className="border shadow-none">
            <CardContent className="p-4">
              <span className="text-xs font-medium text-slate-500 mb-2 block">Total Kredit</span>
              <span className="text-lg font-bold text-red-600">{formatRupiah(totalKredit)}</span>
            </CardContent>
          </Card>
          <Card className="border shadow-none">
            <CardContent className="p-4 flex flex-col">
              <span className="text-xs font-medium text-slate-500 mb-2 block">Saldo Real-time</span>
              <span className="text-lg font-bold text-slate-900">{accountData?.current_balance ? formatRupiah(accountData.current_balance) : 'Rp 0'}</span>
            </CardContent>
          </Card>
        </div>

        {/* Latest Transactions Table */}
        <Card className="border shadow-none">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-semibold">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold text-slate-600">Tanggal</TableHead>
                    <TableHead className="font-semibold text-slate-600">Keterangan</TableHead>
                    <TableHead className="w-[100px] text-center font-semibold text-slate-600">Tipe</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        Memuat transaksi...
                      </TableCell>
                    </TableRow>
                  ) : flatEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        Tidak ada transaksi ditemukan pada periode ini
                      </TableCell>
                    </TableRow>
                  ) : (
                    flatEntries.map((entry: any) => (
                      <TableRow key={entry.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-700">
                           {dayjs(entry.transaction_date).format('DD MMM YYYY, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-slate-800">{entry.transaction_description || entry.description}</span>
                            {entry.description && entry.description !== entry.transaction_description && (
                              <span className="text-xs text-slate-500 mt-1">{entry.description}</span>
                            )}
                            <span className="text-xs text-blue-500 font-medium mt-1">Ref: {entry.reference_number || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase
                             ${entry.entry_type === 'DEBIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                           `}>
                             {entry.entry_type}
                           </span>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${entry.entry_type === 'DEBIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.entry_type === 'DEBIT' ? '+' : '-'}{formatRupiah(entry.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
