"use client";

import React, { useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetPlannings, useCreatePlanning, useUpdatePlanning, useDeletePlanning, Planning } from "@/hooks/api/use-planning";
import { toast } from "sonner";
import dayjs from "dayjs";
import { formatRupiah } from "@/lib/utils";
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

const breadcrumbItems = [{ title: "Perencanaan", link: "/dashboard/perencanaan" }];

export default function PerencanaanPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Planning | null>(null);
  const [deletingItem, setDeletingItem] = useState<Planning | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", start_date: "", end_date: "" });

  const { data, isLoading, refetch } = useGetPlannings({ q: searchQuery || undefined, limit: 50 });
  const createMutation = useCreatePlanning();
  const updateMutation = useUpdatePlanning(editingItem?.id || "");
  const deleteMutation = useDeletePlanning(deletingItem?.id || "");

  const plannings: Planning[] = data?.data || [];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", description: "", start_date: dayjs().format("YYYY-MM-DD"), end_date: dayjs().add(1, 'month').format("YYYY-MM-DD") });
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (item: Planning) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      description: item.description || "", 
      start_date: item.start_date || "", 
      end_date: item.end_date || "" 
    });
    setShowCreateDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) { toast.error("Nama perencanaan wajib diisi"); return; }
    try {
      if (editingItem) {
        await updateMutation.mutateAsync(formData);
        toast.success("Perencanaan berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Perencanaan berhasil dibuat");
      }
      setShowCreateDialog(false);
      refetch();
    } catch {
      toast.error("Gagal menyimpan perencanaan");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync();
      toast.success("Perencanaan berhasil dihapus");
      setShowDeleteDialog(false);
      setDeletingItem(null);
      refetch();
    } catch {
      toast.error("Gagal menghapus perencanaan");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Perencanaan" description="Kelola perencanaan keuangan perusahaan" />
          <Button onClick={handleOpenCreate} className="bg-black text-white hover:bg-black/90">
            <Plus className="mr-2 h-4 w-4" /> Tambah Perencanaan
          </Button>
        </div>
        <Separator />

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari Perencanaan......"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table View */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold text-black">Nama Perencanaan</TableHead>
                <TableHead className="font-semibold text-black">Tanggal Awal</TableHead>
                <TableHead className="font-semibold text-black">Tanggal Akhir</TableHead>
                <TableHead className="font-semibold text-black">Total Perencanaan</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2">
                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                       <span>Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : plannings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada data perencanaan.
                  </TableCell>
                </TableRow>
              ) : (
                plannings.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-gray-50/50"
                    onClick={() => router.push(`/dashboard/perencanaan/${item.id}`)}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.start_date ? dayjs(item.start_date).locale('id').format("dddd, DD MMMM YYYY") : "-"}</TableCell>
                    <TableCell>{item.end_date ? dayjs(item.end_date).locale('id').format("dddd, DD MMMM YYYY") : "-"}</TableCell>
                    <TableCell>{item.total_amount ? formatRupiah(item.total_amount) : "-"}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => { setDeletingItem(item); setShowDeleteDialog(true); }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingItem ? "Edit Perencanaan" : "Tambah Perencanaan"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Isi informasi dibawah untuk menambahkan perencanaan baru
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Nama Perencanaan *</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Perencanaan Keuangan 2024" 
                value={formData.name} 
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} 
                className="bg-gray-50/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-semibold">Tanggal Awal *</Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  value={formData.start_date} 
                  onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))} 
                  className="bg-gray-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-semibold">Tanggal Akhir *</Label>
                <Input 
                  id="end_date" 
                  type="date" 
                  value={formData.end_date} 
                  onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))} 
                  className="bg-gray-50/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="rounded-md px-8 py-2 border-gray-200">
              Batal
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isPending}
              className="bg-black text-white hover:bg-black/90 rounded-md px-8 py-2"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Perencanaan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Yakin ingin menghapus perencanaan <strong>{deletingItem?.name}</strong>? Semua entri rencana di dalamnya juga akan terhapus.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
