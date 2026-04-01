"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AccountFormData } from "../../hooks/use-account-form";
import { Account } from "../../types";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isEditMode: boolean;
  formData: AccountFormData;
  onFormChange: (data: Partial<AccountFormData>) => void;
  headerAccounts?: Account[];
  onSuccess?: () => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  onSave,
  isEditMode,
  formData,
  onFormChange,
  headerAccounts = [],
  onSuccess
}: AccountModalProps) {
  const handleInputChange = (field: keyof AccountFormData, value: string | number) => {
    onFormChange({ [field]: value } as Partial<AccountFormData>);
  };


  const handleSave = () => {
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="bg-blue-600 text-white p-6 -m-6 mb-6">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Akun" : "Tambah Akun"}
          </DialogTitle>
          <p className="text-blue-100 text-sm mt-1">
            Isi Informasi dibawah untuk {isEditMode ? "mengedit" : "menambahkan"} akun
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Akun</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Masukkan nama akun"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Masukkan deskripsi (opsional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Kode Akun</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder="Masukkan kode akun"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipe Akun</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSETS">ASSETS</SelectItem>
                <SelectItem value="LIABILITIES">LIABILITIES</SelectItem>
                <SelectItem value="EQUITY">EQUITY</SelectItem>
                <SelectItem value="REVENUE">REVENUE</SelectItem>
                <SelectItem value="EXPENSE">EXPENSE</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
        
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
