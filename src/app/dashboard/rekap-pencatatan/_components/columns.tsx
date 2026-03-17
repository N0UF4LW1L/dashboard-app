'use client';
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { formatDate, formatRupiah, cn } from "@/lib/utils";

export const getPaymentStatusLabel = (status: string) => {
  if (!status) return "-";
  switch (status.toLowerCase()) {
    case "paid":
    case "lunas":
    case "accepted":
      return "Lunas";
    case "unpaid":
    case "belum lunas":
      return "Belum Lunas";
    default:
      return status;
  }
};

export const getStatusVariant = (status: string) => {
  if (!status) return "bg-gray-100 text-gray-800";
  switch (status.toLowerCase()) {
    case "paid":
    case "lunas":
    case "accepted":
      return "bg-green-100 text-green-800";
    case "unpaid":
    case "belum lunas":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const columnsOrderanSewa: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nama_customer",
    header: "Nama Customer",
    cell: ({ row }) => <span>{row.original.customer?.name ?? "-"}</span>,
  },
  {
    accessorKey: "armada",
    header: "Armada",
    cell: ({ row }) => <span>{row.original.fleet?.name ?? "-"}</span>,
  },
  {
    accessorKey: "nomor_invoice",
    header: "Nomor Invoice",
    cell: ({ row }) => <span>{row.original.invoice_number ?? "-"}</span>,
  },
  {
    accessorKey: "total_harga",
    header: "Total Harga",
    cell: ({ row }) => {
      // Because backend order calculation logic maps differently based on my previous mapping
      const pt = row.original.price_calculation?.grand_total ?? row.original.total_price ?? row.original.totalPrice ?? 0;
      return <span>{formatRupiah(pt)}</span>;
    },
  },
  {
    accessorKey: "pembayaran",
    header: "Pembayaran",
    cell: ({ row }) => {
      // My mapping mapped paymentStatus to 'accepted' or 'status'
      const status = row.original.paymentStatus ?? row.original.status ?? "-";
      return (
        <span
          className={cn(
            getStatusVariant(status),
            "text-xs font-medium inline-flex items-center justify-center py-1 rounded-md text-center px-2",
          )}
        >
          {getPaymentStatusLabel(status)}
        </span>
      );
    },
  },
];

export const columnsProduk: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nama_customer",
    header: "Nama Customer",
    cell: ({ row }) => <span>{row.original.customer?.name ?? "-"}</span>,
  },
  {
    accessorKey: "product",
    header: "Produk",
    cell: ({ row }) => <span>{row.original.product?.name ?? "-"}</span>,
  },
  {
    accessorKey: "kategori",
    header: "Kategori",
    cell: ({ row }) => (
      <span>
        {row.original.product?.category_label ?? row.original.product?.category ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "nomor_invoice",
    header: "Nomor Invoice",
    cell: ({ row }) => <span>{row.original.invoice_number ?? "-"}</span>,
  },
  {
    accessorKey: "total_harga",
    header: "Total Harga",
    cell: ({ row }) => <span>{formatRupiah(row.original.total_price) ?? "-"}</span>,
  },
  {
    accessorKey: "pembayaran",
    header: "Pembayaran",
    cell: ({ row }) => {
      const status = row.original.payment_status ?? row.original.status ?? "-";
      return (
        <span
          className={cn(
            getStatusVariant(status),
            "text-xs font-medium flex items-center justify-center py-1 rounded-md text-center inline-flex px-2",
          )}
        >
          {getPaymentStatusLabel(status)}
        </span>
      );
    },
  },
];

export const columnsReimburse: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nama_driver",
    header: "Nama Driver",
    cell: ({ row }) => <span>{row.original.driver?.name ?? "-"}</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{formatRupiah(row.original.nominal) ?? "-"}</span>,
  },
  {
    accessorKey: "no_rekening",
    header: "No Rekening",
    cell: ({ row }) => <span>{row.original.noRekening ?? "-"}</span>,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span>{formatDate(row.original.date, false) ?? "-"}</span>,
  },
  {
    accessorKey: "nama_bank",
    header: "Nama Bank",
    cell: ({ row }) => <span>{row.original.bank ?? "-"}</span>,
  },
  {
    accessorKey: "kebutuhan",
    header: "Kebutuhan",
    cell: ({ row }) => <span>{row.original.description ?? "-"}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status ?? "-"}</span>,
  },
];

export const columnsInventaris: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nama_aset",
    header: "Nama Aset",
    cell: ({ row }) => <span>{row.original.assetName ?? "-"}</span>,
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah",
    cell: ({ row }) => <span>{row.original.quantity ?? "-"}</span>,
  },
  {
    accessorKey: "harga_satuan",
    header: "Harga Satuan",
    cell: ({ row }) => <span>{formatRupiah(row.original.unitPrice ?? 0)}</span>,
  },
  {
    accessorKey: "total_harga",
    header: "Total Harga",
    cell: ({ row }) => <span>{formatRupiah((row.original.unitPrice ?? 0) * (row.original.quantity ?? 0))}</span>,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span>{formatDate(row.original.purchaseDate, false) ?? "-"}</span>,
  },
];

export const columnsLainnya: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nama_transaksi",
    header: "Nama Transaksi",
    cell: ({ row }) => <span>{row.original.name ?? "-"}</span>,
  },
  {
    accessorKey: "kategori",
    header: "Kategori",
    cell: ({ row }) => <span>{row.original.category ?? row.original.categoryEntity?.name ?? "-"}</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>{formatRupiah(row.original.nominal ?? 0)}</span>,
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => <span>{formatDate(row.original.date, false) ?? "-"}</span>,
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
    cell: ({ row }) => <span>{row.original.description ?? "-"}</span>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} type="lainnya" />,
  },
];

export const columnsCharge: ColumnDef<any>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "nomor_invoice",
    header: "Nomor Invoice",
    cell: ({ row }) => <span>{row.original.invoice_number ?? "-"}</span>,
  },
  {
    accessorKey: "nama_customer",
    header: "Nama Customer",
    cell: ({ row }) => <span>{row.original.customer?.name ?? "-"}</span>,
  },
  {
    accessorKey: "judul",
    header: "Judul",
    cell: ({ row }) => <span>{row.original.charge_type ?? "-"}</span>,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => {
      if (row.original.fleet) {
        return (
          <span>
            {row.original.fleet.name}
            {row.original.fleet.plate_number ? ` (${row.original.fleet.plate_number})` : ""}
          </span>
        );
      } else if (row.original.product) {
        return <span>{row.original.product.name}</span>;
      }
      return <span>-</span>;
    },
  },
  {
    accessorKey: "kategori_transaksi",
    header: "Kategori Transaksi",
    cell: ({ row }) => <span>{row.original.transaction_category?.name ?? "-"}</span>,
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => <span>{row.original.description ?? "-"}</span>,
  },
  {
    accessorKey: "nominal",
    header: "Nominal",
    cell: ({ row }) => <span>{formatRupiah(row.original.amount ?? 0)}</span>,
  },
  {
    accessorKey: "waktu_pelanggaran",
    header: "Waktu Pelanggaran",
    cell: ({ row }) => <span>{formatDate(row.original.violation_time, false) ?? "-"}</span>,
  },
];
