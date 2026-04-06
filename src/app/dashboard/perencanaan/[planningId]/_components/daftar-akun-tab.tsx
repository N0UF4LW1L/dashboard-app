"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, Minus } from "lucide-react";
import { useGetPlanningAccounts, PlanningAccount } from "@/hooks/api/use-planning";
import { cn } from "@/lib/utils";

interface AccountItem extends PlanningAccount {
  expanded: boolean;
  _children: AccountItem[];
}

function organizeHierarchy(accounts: PlanningAccount[]): AccountItem[] {
  const parentMap = new Map<string, PlanningAccount>();
  accounts.forEach((acc) => {
    if (acc.level === 2 && acc.parent) {
      if (!parentMap.has(acc.parent.id)) parentMap.set(acc.parent.id, acc.parent);
    }
  });

  const rootAccounts = Array.from(parentMap.values());
  const level2 = accounts.filter((a) => a.level === 2);

  return rootAccounts.map((root) => ({
    ...root,
    expanded: false,
    _children: level2
      .filter((c) => c.parent_id === root.id)
      .map((c) => ({ ...c, expanded: false, _children: [] })),
  }));
}

function AccountRow({ account, level = 0, expandedSet, onToggle }: {
  account: AccountItem; level?: number; expandedSet: Set<string>; onToggle: (id: string) => void;
}) {
  const isExpanded = expandedSet.has(account.id);
  const hasChildren = account._children && account._children.length > 0;

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border transition-all",
          "hover:bg-gray-50",
          level === 0 ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200",
          level > 0 && `ml-${level * 6}`,
        )}
      >
        <div className="flex items-center space-x-3">
          {hasChildren ? (
            <button onClick={() => onToggle(account.id)} className="p-1 hover:bg-gray-200 rounded">
              {isExpanded ? <Minus className="h-4 w-4 text-blue-600" /> : <ChevronRight className="h-4 w-4 text-blue-600" />}
            </button>
          ) : (
            <div className="w-6" />
          )}
          <Badge variant="outline" className="text-xs font-mono">{account.code}</Badge>
          <span className="font-medium text-gray-900">{account.name}</span>
          <span className="text-sm text-gray-500">({account.type})</span>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {account._children.map((child) => (
            <AccountRow key={child.id} account={child} level={level + 1} expandedSet={expandedSet} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DaftarAkunTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useGetPlanningAccounts({ search: searchQuery || undefined, limit: 1000 });

  const accountsData = useMemo(() => {
    if (!data?.items) return [];
    return organizeHierarchy(data.items);
  }, [data]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat daftar akun...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-600">Gagal memuat data akun</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
        Daftar akun ini diambil dari modul <strong>Realisasi</strong>. Perubahan akun hanya bisa dilakukan di sana.
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari akun..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Keterangan: tidak bisa tambah */}
      <p className="text-xs text-gray-400">* Daftar akun read-only. Tidak dapat ditambah atau diubah dari halaman ini.</p>

      {/* Account List */}
      <Card>
        <CardContent className="p-6">
          {accountsData.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Tidak ada data akun</p>
          ) : (
            <div className="space-y-2">
              {accountsData.map((acc) => (
                <AccountRow key={acc.id} account={acc} expandedSet={expandedIds} onToggle={toggleExpand} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
