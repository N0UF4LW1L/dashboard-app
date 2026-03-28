"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, TrendingUp, Scale, RefreshCw, FileText, Coins, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface LaporanTabProps {
  planningId: string;
}

const reportCards = [
  {
    title: "Jurnal Umum",
    description: "Laporan jurnal umum dari entri perencanaan",
    icon: BookOpen,
    subIcon: Coins,
    href: "jurnal-umum",
  },
  {
    title: "Laba Rugi",
    description: "Laporan laba rugi perencanaan",
    icon: TrendingUp,
    subIcon: TrendingUp,
    href: "laba-rugi",
  },
  {
    title: "Neraca",
    description: "Laporan neraca perencanaan",
    icon: Scale,
    subIcon: Scale,
    href: "neraca",
  },
  {
    title: "Arus Kas",
    description: "Laporan arus kas perencanaan",
    icon: RefreshCw,
    subIcon: ArrowUpDown,
    href: "arus-kas",
  },
];

export default function LaporanTab({ planningId }: LaporanTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((report) => {
          const SubIcon = report.subIcon;
          return (
            <Card
              key={report.href}
              className="w-full h-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-0"
              onClick={() => router.push(`/dashboard/perencanaan/${planningId}/laporan/${report.href}`)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
                <div className="z-10">
                  <h3 className="text-xl font-bold text-blue-800">{report.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                </div>
                
                {/* Graphic style from realization */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200 rounded-full transform translate-x-8 translate-y-8" />
                  <div className="absolute bottom-4 right-4 flex flex-col items-center">
                    <FileText className="h-8 w-8 text-blue-400" />
                    <div className="flex items-center space-x-1 mt-1">
                      <SubIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-400 font-bold text-lg">Rp</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Informasi Laporan Perencanaan</h4>
        <p className="text-sm text-blue-700">
          Laporan di sini dihitung dari entri rencana yang Anda buat di tab <strong>Rencana</strong>.
          Data ini bersifat perencanaan dan tidak terhubung dengan data realisasi aktual.
        </p>
      </div>
    </div>
  );
}
