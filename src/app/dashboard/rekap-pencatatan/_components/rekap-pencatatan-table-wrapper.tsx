"use client";
import RekapPencatatanTabLists from "./rekap-pencatatan-tab-lists";
import SearchInput from "@/components/search-input";
import { Loader2 } from "lucide-react";
import {
  columnsOrderanSewa,
  columnsReimburse,
  columnsInventaris,
  columnsLainnya,
} from "./columns";
import { RekapPencatatanTable } from "./rekap-pencatatan-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  useGetOrderanSewa,
  useGetReimburse,
  useGetInventaris,
  useGetLainnya,
} from "@/hooks/api/use-rekap";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Download, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import { apiClient } from "@/lib/api-client";
import { RekapLainnyaForm } from "./rekap-lainnya-form";
import { useCreateLainnya } from "@/hooks/api/use-rekap-mutations";
import { toast } from "sonner";

const Spinner = () => (
  <div className="flex justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const TABS = [
  { name: "Orderan Fleets", value: "orderan-sewa" },
  { name: "Reimburse", value: "reimburse" },
  { name: "Inventaris", value: "inventaris" },
  { name: "Lainnya", value: "lainnya" },
];

const RekapPencatatanTableWrapper = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const defaultTab = searchParams.get("type") ?? "orderan-sewa";
  const q = searchParams.get("q");
  const [searchQuery, setSearchQuery] = React.useState<string>(q ?? "");
  const [searchDebounce] = useDebounce(searchQuery, 500);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<"csv" | "xlsx">("csv");
  const [exportScope, setExportScope] = React.useState<"current" | "all">("current");
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({});

  const [showForm, setShowForm] = React.useState(false);
  const createLainnyaMut = useCreateLainnya();

  const [activeTab, setActiveTab] = React.useState<string>(defaultTab);

  const handleFormSubmit = async (payload: any) => {
    try {
      await createLainnyaMut.mutateAsync(payload);
      toast.success("Data berhasil ditambahkan");
      setShowForm(false);
    } catch (e) {
      toast.error("Terjadi kesalahan saat menambahkan data");
    }
  };

  // Sync activeTab dari URL
  useEffect(() => {
    const currentType = searchParams.get("type");
    if (currentType && currentType !== activeTab) {
      setActiveTab(currentType);
    }
  }, [searchParams, activeTab]);

  // Fetch hanya tab yang aktif
  const { data: orderanSewaData, isFetching: isFetchingOrderanSewa } =
    useGetOrderanSewa(
      { limit: pageLimit, page, q: searchDebounce },
      { enabled: activeTab === "orderan-sewa" },
    ) as any;

  const { data: reimburseData, isFetching: isFetchingReimburse } =
    useGetReimburse(
      { limit: pageLimit, page, q: searchDebounce },
      { enabled: activeTab === "reimburse" },
    ) as any;

  const { data: inventarisData, isFetching: isFetchingInventaris } =
    useGetInventaris(
      { limit: pageLimit, page, q: searchDebounce },
      { enabled: activeTab === "inventaris" },
    ) as any;

  const { data: lainnyaData, isFetching: isFetchingLainnya } =
    useGetLainnya(
      { limit: pageLimit, page, q: searchDebounce },
      { enabled: activeTab === "lainnya" },
    ) as any;

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== "") {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [],
  );

  // Push URL ketika search/tab berubah
  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        type: activeTab,
        q: searchDebounce || null,
        limit: pageLimit,
      })}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, activeTab, pageLimit]);

  // ──── Download ────────────────────────────────────────────────────────────
  const handleGenerateAndDownload = async () => {
    setIsDownloading(true);
    try {
      if (dateRange?.from && dateRange?.to && dateRange.to < dateRange.from) {
        alert("Tanggal akhir harus setelah atau sama dengan tanggal mulai.");
        return;
      }

      const dateParams: Record<string, any> = {};
      const fromStr = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
      const toStr = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
      if (fromStr && toStr) {
        dateParams.startDate = fromStr;
        dateParams.endDate = toStr;
      } else if (fromStr) {
        dateParams.startDate = fromStr;
        dateParams.endDate = fromStr;
      } else if (toStr) {
        dateParams.startDate = toStr;
        dateParams.endDate = toStr;
      }

      const params: any = {
        limit: exportScope === "all" ? 999999 : pageLimit,
        page: exportScope === "all" ? 1 : page,
        q: searchDebounce,
        ...dateParams,
      };

      let endpoint = "";
      const tabToEndpoint: Record<string, string> = {
        "orderan-sewa": "/rekap-transaksi/orderan-sewa",
        reimburse: "/rekap-transaksi/reimburse",
        inventaris: "/inventories",
        lainnya: "/rekap-transaksi/lainnya",
      };
      endpoint = tabToEndpoint[activeTab] ?? "";
      if (activeTab === "inventaris") {
        params.status = "verified";
        params.search = params.q;
        delete params.q;
      }

      const res = await apiClient.get(endpoint, { params });
      const response = res.data;

      let currentData: any[] = [];
      // Semua endpoint sekarang mengembalikan { items, meta }
      currentData = response?.items || [];

      const tabNameMap: Record<string, string> = {
        "orderan-sewa": "Orderan Fleets",
        reimburse: "Reimburse",
        inventaris: "Inventaris",
        lainnya: "Lainnya",
      };
      const tabName = tabNameMap[activeTab] ?? "Rekap Pencatatan";

      if (currentData.length === 0) {
        alert("Tidak ada data untuk diunduh");
        return;
      }

      let rows: any[] = [];
      if (activeTab === "orderan-sewa") {
        rows = currentData.map((data: any, i: number) => {
          const discount = data.price_calculation?.discount_percentage ?? 0;
          const addSvcTotal = Array.isArray(data.additional_services)
            ? data.additional_services.reduce((s: number, it: any) => s + (Number(it?.price) || 0), 0)
            : 0;
          const startDate = data.start_date
            ? format(new Date(data.start_date), "EEEE, dd MMMM yyyy HH:mm", { locale: id })
            : "-";
          return {
            No: i + 1,
            "Nama Customer": data.customer?.name || "-",
            Armada: data.fleet?.name || "-",
            "Tanggal Sewa": startDate,
            "Harga Unit": formatRupiah(data.price_calculation?.rent_price ?? 0),
            "Durasi Penyewaan": data.duration ?? 0,
            "Total Harga Unit": formatRupiah(data.price_calculation?.total_rent_price ?? 0),
            "Discount (%)": discount,
            "Total Potongan Diskon Unit": formatRupiah(data.price_calculation?.discount ?? 0),
            "Total Harga Setelah Diskon": formatRupiah(
              (data.price_calculation?.total_rent_price ?? 0) - (data.price_calculation?.discount ?? 0),
            ),
            "Charge Weekend": formatRupiah(data.price_calculation?.total_weekend_price ?? 0),
            "Layanan Antar Jemput": formatRupiah(data.price_calculation?.service_price ?? 0),
            "Layanan Luar Kota": formatRupiah(data.price_calculation?.out_of_town_price ?? 0),
            "Layanan Driver": formatRupiah(data.price_calculation?.total_driver_price ?? 0),
            "Layanan Asuransi": formatRupiah(data.price_calculation?.insurance_price ?? 0),
            "Layanan Add-Ons": formatRupiah(data.addons_price ?? 0),
            "Layanan Lainnya": formatRupiah(addSvcTotal),
            "Total Harga Keseluruhan": formatRupiah(data.price_calculation?.grand_total ?? 0),
            "No Invoice": data.invoice_number || "-",
            Status: data.status === "accepted" ? "Lunas" : (data.status ?? "-"),
          };
        });
      } else if (activeTab === "reimburse") {
        rows = currentData.map((item: any, i: number) => ({
          No: i + 1,
          "Nama Driver": item.driver?.name || "-",
          Total: formatRupiah(item.nominal || 0),
          "No Rekening": item.noRekening || "-",
          Tanggal: item.date ? format(new Date(item.date), "EEEE, dd MMMM yyyy HH:mm", { locale: id }) : "-",
          "Nama Bank": item.bank || "-",
          Kebutuhan: item.description || "-",
          Status: item.status || "-",
        }));
      } else if (activeTab === "inventaris") {
        rows = currentData.map((item: any, i: number) => ({
          No: i + 1,
          "Nama Aset": item.assetName || item.name || "-",
          Jumlah: item.quantity || 0,
          "Harga Satuan": formatRupiah(item.unitPrice ?? item.unit_price ?? 0),
          "Total Harga": formatRupiah((item.unitPrice ?? 0) * (item.quantity ?? 0)),
          Tanggal: item.purchaseDate
            ? format(new Date(item.purchaseDate), "EEEE, dd MMMM yyyy HH:mm", { locale: id })
            : "-",
        }));
      } else if (activeTab === "lainnya") {
        rows = currentData.map((item: any, i: number) => ({
          No: i + 1,
          "Nama Transaksi": item.name || "-",
          Kategori: item.category || "-",
          Total: formatRupiah(item.nominal ?? 0),
          Tanggal: item.date
            ? format(new Date(item.date), "EEEE, dd MMMM yyyy HH:mm", { locale: id })
            : "-",
          Keterangan: item.description || "-",
        }));
      }

      if (exportFormat === "xlsx") {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, tabName);
        XLSX.writeFile(wb, `${tabName}-${new Date().toISOString().split("T")[0]}.xlsx`);
      } else {
        const headers = Object.keys(rows[0]);
        const csv = [headers.join(",")]
          .concat(
            rows.map((row) =>
              headers
                .map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`)
                .join(","),
            ),
          )
          .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `${tabName}-${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mengunduh data. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
      setIsExportDialogOpen(false);
    }
  };

  return (
    <Tabs value={activeTab}>
      {/* ── Header: Tabs + Search + Actions ─────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <RekapPencatatanTabLists lists={TABS} />
        <div className="flex items-center gap-4 flex-wrap">
          {activeTab === "lainnya" && (
            <Button onClick={() => setShowForm(true)}>Tambah Baru</Button>
          )}
          <SearchInput
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Cari data rekap pencatatan"
          />
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            disabled={isDownloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Memproses..." : "Unduh Rekap"}
          </Button>
        </div>
      </div>

      {/* ── Export Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unduh Rekap</DialogTitle>
            <DialogDescription>Pilih format, rentang tanggal, dan cakupan data.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cakupan</label>
                <Select value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Halaman saat ini</SelectItem>
                    <SelectItem value="all">Semua hasil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rentang Tanggal</label>
              <div className="grid grid-cols-2 gap-4">
                {/* From */}
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Dari</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal relative">
                        {dateRange?.from ? format(dateRange.from, "PPP") : <span className="text-muted-foreground">Pilih tanggal</span>}
                        <div className="absolute right-2">
                          {dateRange?.from ? (
                            <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); setDateRange({ ...dateRange, from: undefined }); }} />
                          ) : (
                            <CalendarIcon className="h-4 w-4" />
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange?.from}
                        onSelect={(d: Date | undefined) => setDateRange({ ...dateRange, from: d })}
                        disabled={dateRange?.to ? { after: dateRange.to } : undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* To */}
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Hingga</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal relative">
                        {dateRange?.to ? format(dateRange.to, "PPP") : <span className="text-muted-foreground">Pilih tanggal</span>}
                        <div className="absolute right-2">
                          {dateRange?.to ? (
                            <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); setDateRange({ ...dateRange, to: undefined }); }} />
                          ) : (
                            <CalendarIcon className="h-4 w-4" />
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange?.to}
                        onSelect={(d: Date | undefined) => setDateRange({ ...dateRange, to: d })}
                        disabled={dateRange?.from ? { before: dateRange.from } : undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Untuk data besar, gunakan filter tanggal agar proses lebih cepat.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Batal</Button>
            <Button onClick={handleGenerateAndDownload} disabled={isDownloading}>
              {isDownloading ? "Memproses..." : "Unduh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Lainnya Form ──────────────────────────────────────────────── */}
      {showForm && (
        <RekapLainnyaForm
          open={showForm}
          onOpenChange={(op) => { if (!op) setShowForm(false); }}
          onSubmit={handleFormSubmit}
          isSubmitting={createLainnyaMut.isPending}
        />
      )}

      {/* ── Tab Contents ──────────────────────────────────────────────── */}
      <TabsContent value="orderan-sewa" className="space-y-4">
        {isFetchingOrderanSewa && <Spinner />}
        {!isFetchingOrderanSewa && (
          <RekapPencatatanTable
            columns={columnsOrderanSewa}
            data={orderanSewaData?.items || []}
            type="orderan-sewa"
            searchKey="customer.name"
            totalUsers={orderanSewaData?.meta?.total_items || 0}
            pageCount={Math.ceil((orderanSewaData?.meta?.total_items || 0) / pageLimit) || 1}
            pageNo={page}
          />
        )}
      </TabsContent>

      <TabsContent value="reimburse" className="space-y-4">
        {isFetchingReimburse && <Spinner />}
        {!isFetchingReimburse && (
          <RekapPencatatanTable
            columns={columnsReimburse}
            data={reimburseData?.items || []}
            type="reimburse"
            searchKey="driver.name"
            totalUsers={reimburseData?.meta?.total_items || 0}
            pageCount={Math.ceil((reimburseData?.meta?.total_items || 0) / pageLimit) || 1}
            pageNo={page}
          />
        )}
      </TabsContent>

      <TabsContent value="inventaris" className="space-y-4">
        {isFetchingInventaris && <Spinner />}
        {!isFetchingInventaris && (
          <RekapPencatatanTable
            columns={columnsInventaris}
            data={inventarisData?.items || []}
            type="inventaris"
            searchKey="assetName"
            totalUsers={inventarisData?.meta?.total_items || 0}
            pageCount={Math.ceil((inventarisData?.meta?.total_items || 0) / pageLimit) || 1}
            pageNo={page}
          />
        )}
      </TabsContent>

      <TabsContent value="lainnya" className="space-y-4">
        {isFetchingLainnya && <Spinner />}
        {!isFetchingLainnya && (
          <RekapPencatatanTable
            columns={columnsLainnya}
            data={lainnyaData?.items || []}
            type="lainnya"
            searchKey="name"
            totalUsers={lainnyaData?.meta?.total_items || 0}
            pageCount={Math.ceil((lainnyaData?.meta?.total_items || 0) / pageLimit) || 1}
            pageNo={page}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default RekapPencatatanTableWrapper;
