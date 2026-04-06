"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import { formatRupiah } from "@/lib/utils";
import {
  useGetPlanningEntries,
  useCreatePlanningEntry,
  useUpdatePlanningEntry,
  useDeletePlanningEntry,
  useGetPlanningAccounts,
  PlanningEntry,
  PlanningAccount,
} from "@/hooks/api/use-planning";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface RencanaTabProps {
  planningId: string;
}

interface EntryForm {
  date: string;
  account_debit_id: string;
  account_credit_id: string;
  amount: number | string;
  note: string;
}

const emptyForm: EntryForm = {
  date: dayjs().format("YYYY-MM-DD"),
  account_debit_id: "",
  account_credit_id: "",
  amount: "",
  note: "",
};

export default function RencanaTab({ planningId }: RencanaTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlanningEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<PlanningEntry | null>(null);
  const [form, setForm] = useState<EntryForm>(emptyForm);

  const { data: entriesData, isLoading, refetch } = useGetPlanningEntries(planningId, {
    q: searchQuery || undefined,
    limit: 200,
  });
  const { data: accountsData } = useGetPlanningAccounts({ limit: 1000 });
  const createMutation = useCreatePlanningEntry(planningId);
  const updateMutation = useUpdatePlanningEntry(planningId, editingEntry?.id || "");
  const deleteMutation = useDeletePlanningEntry(planningId, deletingEntry?.id || "");

  const entries: PlanningEntry[] = entriesData?.items || [];
  const accounts: PlanningAccount[] = accountsData?.items || [];

  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => !a.is_header);
  }, [accounts]);

  const accountMap = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);

  const handleOpenCreate = () => {
    setEditingEntry(null);
    setForm(emptyForm);
    setShowDialog(true);
  };

  const handleOpenEdit = (entry: PlanningEntry) => {
    setEditingEntry(entry);
    setForm({
      date: entry.date,
      account_debit_id: entry.account_debit_id,
      account_credit_id: entry.account_credit_id,
      amount: entry.amount,
      note: entry.note || "",
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!form.date) { toast.error("Tanggal wajib diisi"); return; }
    if (!form.account_debit_id) { toast.error("Akun Debit wajib dipilih"); return; }
    if (!form.account_credit_id) { toast.error("Akun Kredit wajib dipilih"); return; }
    if (!form.amount || Number(form.amount) <= 0) { toast.error("Jumlah harus lebih dari 0"); return; }
    if (form.account_debit_id === form.account_credit_id) { toast.error("Akun Debit dan Kredit tidak boleh sama"); return; }

    const payload = {
      date: form.date,
      account_debit_id: form.account_debit_id,
      account_credit_id: form.account_credit_id,
      amount: Number(form.amount),
      note: form.note || undefined,
    };

    try {
      if (editingEntry) {
        await updateMutation.mutateAsync(payload);
        toast.success("Rencana berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Rencana berhasil ditambahkan");
      }
      setShowDialog(false);
      refetch();
    } catch {
      toast.error("Gagal menyimpan rencana");
    }
  };

  const handleDelete = async () => {
    if (!deletingEntry) return;
    try {
      await deleteMutation.mutateAsync();
      toast.success("Rencana berhasil dihapus");
      setShowDeleteDialog(false);
      setDeletingEntry(null);
      refetch();
    } catch {
      toast.error("Gagal menghapus rencana");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Cari keterangan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-gray-200">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={handleOpenCreate} className="bg-black text-white hover:bg-black/90">
            <Plus className="mr-1 h-4 w-4" /> Tambah Rencana
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="font-semibold text-black">Tanggal</TableHead>
              <TableHead className="font-semibold text-black">Akun Debit</TableHead>
              <TableHead className="font-semibold text-black">Akun Kredit</TableHead>
              <TableHead className="font-semibold text-black text-right">Jumlah</TableHead>
              <TableHead className="font-semibold text-black">Keterangan</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                   <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <span>Memuat data...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Belum ada data rencana. Klik <strong>Tambah Rencana</strong> untuk mulai.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => {
                const debitAcc = accountMap.get(entry.account_debit_id);
                const creditAcc = accountMap.get(entry.account_credit_id);
                return (
                  <TableRow key={entry.id} className="hover:bg-gray-50/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      {dayjs(entry.date).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      {debitAcc ? `${debitAcc.code} - ${debitAcc.name}` : entry.account_debit_id}
                    </TableCell>
                    <TableCell>
                      {creditAcc ? `${creditAcc.code} - ${creditAcc.name}` : entry.account_credit_id}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatRupiah(entry.amount)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.note || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(entry)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => { setDeletingEntry(entry); setShowDeleteDialog(true); }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {entries.length > 0 && (
            <tfoot className="bg-gray-50/50 border-t">
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-black">Total</TableCell>
                <TableCell className="text-right font-bold text-black">
                  {formatRupiah(entries.reduce((s, e) => s + Number(e.amount), 0))}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </tfoot>
          )}
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingEntry ? "Edit Rencana" : "Tambah Rencana"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Isi informasi dibawah untuk menambahkan transaksi
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tanggal *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="bg-gray-50/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Jumlah (Rp) *</Label>
                <Input
                  type="number" min={0} placeholder="0" value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  className="bg-gray-50/50"
                />
              </div>
            </div>



            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Akun Debit *</Label>
                <Select value={form.account_debit_id} onValueChange={(v) => setForm((p) => ({ ...p, account_debit_id: v }))}>
                  <SelectTrigger className="bg-gray-50/50"><SelectValue placeholder="Pilih akun debit" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.code} - {acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Akun Kredit *</Label>
                <Select value={form.account_credit_id} onValueChange={(v) => setForm((p) => ({ ...p, account_credit_id: v }))}>
                  <SelectTrigger className="bg-gray-50/50"><SelectValue placeholder="Pilih akun kredit" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.code} - {acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Keterangan</Label>
              <Textarea placeholder="Keterangan rencana (misal: Alokasi gaji Januari)" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} rows={2} className="bg-gray-50/50" />
            </div>
          </div>
          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="rounded-md px-8 py-2 border-gray-200">
              Batal
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-black text-white hover:bg-black/90 rounded-md px-8 py-2"
            >
              {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Hapus Rencana</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Yakin ingin menghapus entri rencana ini?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
