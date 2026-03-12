'use client';

import { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AddonCellAction } from './addon-cell-action';
import { formatRupiah } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Addon {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
}

interface AddonTableProps {
    data: Addon[];
    isLoading: boolean;
    pageSizeOptions?: number[];
}

const columns: ColumnDef<Addon>[] = [
    {
        accessorKey: 'name',
        header: 'Nama Add-on',
    },
    {
        accessorKey: 'category',
        header: 'Kategori',
    },
    {
        accessorKey: 'price',
        header: 'Harga Persatuan',
        cell: ({ row }) => <span>{formatRupiah(row.original.price)}</span>,
    },
    {
        accessorKey: 'stock',
        header: 'Stok',
    },
    {
        id: 'actions',
        cell: ({ row }) => <AddonCellAction data={row.original} />,
    },
];

export default function AddonTable({
    data,
    isLoading,
    pageSizeOptions = [10, 20, 30, 40, 50],
}: AddonTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            globalFilter,
            pagination,
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Search add-on..."
                    value={globalFilter ?? ''}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="w-full sm:max-w-sm"
                />
            </div>

            <div className="rounded-md border bg-white">
                <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Sedang memuat data...
                                        </div>
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
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
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
                                        Tidak ada hasil.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
                <div className="flex w-full items-center justify-between">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Menampilkan {table.getFilteredRowModel().rows.length} entri
                    </div>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                        <div className="flex items-center space-x-2">
                            <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pagination.pageSize} />
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
                <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            aria-label="Go to previous page"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </Button>
                        <Button
                            aria-label="Go to next page"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
