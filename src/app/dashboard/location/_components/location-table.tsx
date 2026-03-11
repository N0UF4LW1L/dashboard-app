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
} from 'lucide-react';
import Spinner from '@/components/spinner';
import { LocationCellAction } from './location-cell-action';

interface Location {
    id: string;
    name: string;
    address: string;
}

interface LocationTableProps {
    data: Location[];
    isLoading: boolean;
    pageSizeOptions?: number[];
}

const columns: ColumnDef<Location>[] = [
    {
        accessorKey: 'name',
        header: 'Nama Lokasi',
    },
    {
        accessorKey: 'address',
        header: 'Alamat',
        cell: ({ row }) => (
            <span className="line-clamp-2">{row.original.address}</span>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <LocationCellAction data={row.original} />,
    },
];

export default function LocationTable({
    data,
    isLoading,
    pageSizeOptions = [10, 20, 30, 40, 50],
}: LocationTableProps) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const filteredData = React.useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((l) =>
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.address.toLowerCase().includes(searchQuery.toLowerCase()),
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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            {/* Filter bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
                <Input
                    placeholder="Cari lokasi..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                    }}
                    className="w-full md:max-w-sm"
                />
            </div>

            {/* Table */}
            <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
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
                            aria-label="Halaman pertama"
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Halaman sebelumnya"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Halaman berikutnya"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                            aria-label="Halaman terakhir"
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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
