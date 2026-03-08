'use client';

import {
    ColumnDef,
    PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CalendarDays,
} from 'lucide-react';
import Spinner from '@/components/spinner';
import { OrderCellAction } from './order-cell-action';
import { cn, formatRupiah, formatDate } from '@/lib/utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Order {
    id: string;
    customer: { name: string };
    vehicle: { name: string };
    rentalDays: number;
    startDate: string;
    endDate: string;
    usageArea: string;
    totalPrice: number;
    paymentStatus: string;
    isReturned: boolean;
    invoiceNumber?: string;
}

interface OrderTableProps {
    data: Order[];
    isLoading: boolean;
    pageSizeOptions?: number[];
}

// ─── Logika status berdasarkan tanggal ───────────────────────────────────────
type OrderStatus = 'menunggu' | 'berjalan' | 'selesai';

function getOrderStatus(order: Order): OrderStatus {
    if (order.isReturned) return 'selesai';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(order.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(order.endDate);
    end.setHours(0, 0, 0, 0);

    if (start > today) return 'menunggu';
    if (end < today) return 'selesai';
    return 'berjalan';
}
// ─────────────────────────────────────────────────────────────────────────────

const columns: ColumnDef<Order>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">No. Invoice</span>
        ),
        cell: ({ row }) => <span>{row.original.invoiceNumber ?? '-'}</span>,
    },
    {
        accessorKey: 'customer',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">Pelanggan</span>
        ),
        cell: ({ row }) => <span>{row.original.customer?.name ?? '-'}</span>,
    },
    {
        accessorKey: 'vehicle',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">Armada</span>
        ),
        cell: ({ row }) => <span>{row.original.vehicle?.name ?? '-'}</span>,
    },
    {
        accessorKey: 'duration',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">Waktu</span>
        ),
        cell: ({ row }) => (
            <HoverCard>
                <HoverCardTrigger className="bg-[#f5f5f5] rounded-full py-1 px-3 text-nowrap cursor-pointer">
                    {row.original.rentalDays} Hari
                </HoverCardTrigger>
                <HoverCardContent
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-muted-foreground font-normal text-[12px] leading-4">
                            Tanggal Pengambilan
                        </span>
                    </div>
                    <div className="pt-1">
                        <p className="text-[14px] font-semibold leading-5 mb-1 text-blue-600">
                            {formatDate(row.original.startDate, true)}
                        </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-muted-foreground font-normal text-[12px] leading-4">
                            Tanggal Pengembalian
                        </span>
                    </div>
                    <div className="pt-1">
                        <p className="text-[14px] font-semibold leading-5 text-green-600">
                            {formatDate(row.original.endDate, true)}
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>
        ),
    },
    {
        accessorKey: 'usageArea',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">
                Area Penggunaan
            </span>
        ),
        cell: ({ row }) => <span>{row.original.usageArea}</span>,
    },
    {
        accessorKey: 'totalPrice',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">
                Total Harga
            </span>
        ),
        cell: ({ row }) => <span>{formatRupiah(row.original.totalPrice)}</span>,
    },
    {
        accessorKey: 'paymentStatus',
        header: () => (
            <span className="text-sm font-semibold text-neutral-700">Pembayaran</span>
        ),
        cell: ({ row }) => {
            const isLunas = row.original.paymentStatus === 'Lunas';
            return (
                <span
                    className={cn(
                        'text-xs font-medium flex items-center justify-center py-1 rounded-md text-center max-w-24',
                        isLunas ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                    )}
                >
                    {row.original.paymentStatus}
                </span>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <OrderCellAction data={row.original} />,
    },
];

// ─── Sub-komponen tabel (reusable untuk setiap tab) ──────────────────────────
function OrderDataTable({
    data,
    pageSizeOptions = [10, 20, 30, 40, 50],
    searchQuery,
    onSearchChange,
}: {
    data: Order[];
    pageSizeOptions?: number[];
    searchQuery: string;
    onSearchChange: (v: string) => void;
}) {
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });

    const filteredData = React.useMemo(() => {
        if (!searchQuery) return data;
        const q = searchQuery.toLowerCase();
        return data.filter(
            (o) =>
                o.customer?.name?.toLowerCase().includes(q) ||
                o.vehicle?.name?.toLowerCase().includes(q) ||
                o.invoiceNumber?.toLowerCase().includes(q)
        );
    }, [data, searchQuery]);

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(filteredData.length / pageSize),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination: { pageIndex, pageSize },
        },
        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
                <Input
                    placeholder="Cari Invoice, Pelanggan, atau Armada"
                    value={searchQuery}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                    }}
                    className="w-full md:max-w-sm"
                />
            </div>

            <ScrollArea className="rounded-md border h-[calc(80vh-280px)]">
                <Table className="relative">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="last:flex last:justify-end"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data yang dapat ditampilkan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Pagination */}
            <div className="flex flex-col gap-2 sm:flex-row items-center justify-end space-x-2 py-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                        <div className="flex items-center space-x-2">
                            <p className="whitespace-nowrap text-sm font-medium">
                                Data per halaman
                            </p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {pageSizeOptions.map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
                    <div className="flex w-[120px] items-center justify-center text-sm font-medium">
                        Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            aria-label="Go to first page"
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to previous page"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to next page"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Go to last page"
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function OrderTable({
    data,
    isLoading,
    pageSizeOptions = [10, 20, 30, 40, 50],
}: OrderTableProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    // Partisi data berdasarkan status tanggal
    const { menunggu, berjalan, selesai } = React.useMemo(() => {
        const menunggu: Order[] = [];
        const berjalan: Order[] = [];
        const selesai: Order[] = [];

        data.forEach((order) => {
            const status = getOrderStatus(order);
            if (status === 'menunggu') menunggu.push(order);
            else if (status === 'berjalan') berjalan.push(order);
            else selesai.push(order);
        });

        return { menunggu, berjalan, selesai };
    }, [data]);

    if (isLoading) return <Spinner />;

    return (
        <Tabs defaultValue="menunggu">
            {/* Tab header — sama persis dengan referensi */}
            <TabsList>
                <TabsTrigger value="menunggu" id="tab-menunggu">
                    Menunggu
                </TabsTrigger>
                <TabsTrigger value="berjalan" id="tab-berjalan">
                    Sedang Berjalan
                </TabsTrigger>
                <TabsTrigger value="selesai" id="tab-selesai">
                    Selesai
                </TabsTrigger>
            </TabsList>

            {/* Tab: Menunggu */}
            <TabsContent value="menunggu" className="space-y-4">
                <OrderDataTable
                    data={menunggu}
                    pageSizeOptions={pageSizeOptions}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </TabsContent>

            {/* Tab: Sedang Berjalan */}
            <TabsContent value="berjalan" className="space-y-4">
                <OrderDataTable
                    data={berjalan}
                    pageSizeOptions={pageSizeOptions}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </TabsContent>

            {/* Tab: Selesai */}
            <TabsContent value="selesai" className="space-y-4">
                <OrderDataTable
                    data={selesai}
                    pageSizeOptions={pageSizeOptions}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </TabsContent>
        </Tabs>
    );
}
