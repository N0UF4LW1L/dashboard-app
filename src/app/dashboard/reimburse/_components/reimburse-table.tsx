'use client';

import React, { useState, useMemo } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { useGetReimburses } from '@/hooks/api/use-reimburse';
import { ReimburseCellAction } from './reimburse-cell-action';
import Spinner from '@/components/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Reimburse {
    id: string;
    employeeName: string;
    employeeRole: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    vehicle?: { name: string };
    expenseDate: string;
    expenseSource: string;
    description: string;
    receiptUrl?: string;
    status: 'request' | 'pending' | 'rejected' | 'confirmed';
}

const columns: ColumnDef<Reimburse>[] = [
    {
        accessorKey: 'employeeName',
        header: () => <span className="font-semibold text-neutral-700">Nama Karyawan</span>,
        cell: ({ row }) => <span>{row.original.employeeName}</span>,
    },
    {
        accessorKey: 'employeeRole',
        header: () => <span className="font-semibold text-neutral-700">Role</span>,
        cell: ({ row }) => <span>{row.original.employeeRole}</span>,
    },
    {
        accessorKey: 'amount',
        header: () => <span className="font-semibold text-neutral-700">Nominal</span>,
        cell: ({ row }) => <span>Rp {Number(row.original.amount).toLocaleString('id-ID')}</span>,
    },
    {
        accessorKey: 'bankName',
        header: () => <span className="font-semibold text-neutral-700">Bank / Pembayaran</span>,
        cell: ({ row }) => <span>{row.original.bankName}</span>,
    },
    {
        accessorKey: 'accountNumber',
        header: () => <span className="font-semibold text-neutral-700">No. Rekening</span>,
        cell: ({ row }) => <span>{row.original.accountNumber}</span>,
    },
    {
        accessorKey: 'vehicle',
        header: () => <span className="font-semibold text-neutral-700">Kendaraan (Opsional)</span>,
        cell: ({ row }) => <span>{row.original.vehicle?.name || '-'}</span>,
    },
    {
        accessorKey: 'expenseDate',
        header: () => <span className="font-semibold text-neutral-700">Tanggal</span>,
        cell: ({ row }) => <span>{row.original.expenseDate ? row.original.expenseDate.split('T')[0] : '-'}</span>,
    },
    {
        accessorKey: 'expenseSource',
        header: () => <span className="font-semibold text-neutral-700">Sumber</span>,
        cell: ({ row }) => <span>{row.original.expenseSource}</span>,
    },
    {
        accessorKey: 'description',
        header: () => <span className="font-semibold text-neutral-700">Keterangan</span>,
        cell: ({ row }) => <span className="max-w-[150px] truncate block" title={row.original.description}>{row.original.description}</span>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <ReimburseCellAction data={row.original} />,
    },
];

export function ReimburseTable() {
    const { data, isLoading } = useGetReimburses();
    const [activeTab, setActiveTab] = useState<'request' | 'pending' | 'rejected' | 'confirmed'>('request');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 300);

    const SafeLowerCase = (str: any) => (str ? String(str).toLowerCase() : '');

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter((item: Reimburse) => {
            const matchesTab = item.status === activeTab;
            const matchesSearch = SafeLowerCase(item.employeeName).includes(SafeLowerCase(debouncedSearch));
            return matchesTab && matchesSearch;
        });
    }, [data, activeTab, debouncedSearch]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const requestCount = (data || []).filter((d: Reimburse) => d.status === 'request').length;
    const pendingCount = (data || []).filter((d: Reimburse) => d.status === 'pending').length;
    const rejectedCount = (data || []).filter((d: Reimburse) => d.status === 'rejected').length;
    const confirmedCount = (data || []).filter((d: Reimburse) => d.status === 'confirmed').length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <Tabs
                    value={activeTab}
                    onValueChange={(val) => setActiveTab(val as any)}
                >
                    <TabsList>
                        <TabsTrigger value="request">
                            Request ({requestCount})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Menunggu ({pendingCount})
                        </TabsTrigger>
                        <TabsTrigger value="rejected">
                            Ditolak ({rejectedCount})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed">
                            Terkonfirmasi ({confirmedCount})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="w-full lg:w-auto">
                    <Input
                        placeholder="Cari nama karyawan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full lg:w-[390px]"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-neutral-500"
                                >
                                    Tidak ada data untuk status ini.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
