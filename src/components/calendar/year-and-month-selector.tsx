"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthYearState } from "@/hooks/useMonthYearState";
import { MONTHS } from "./utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const YearAndMonthSelector = () => {
    const {
        month,
        year,
        setMonth,
        setYear,
        searchQuery,
        setSearchQuery,
        handlePrevMonth,
        handleNextMonth,
    } = useMonthYearState();

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <div className="flex flex-row items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari armada..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                />
            </div>

            <div className="flex flex-row items-center shadow-sm rounded-md border border-neutral-200 p-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded hover:bg-neutral-100"
                    onClick={handlePrevMonth}
                >
                    <ChevronLeft className="h-4 w-4 text-neutral-500" />
                </Button>
                <p className="w-[100px] text-center font-medium text-[14px] text-neutral-800">
                    {MONTHS[month - 1]} {year}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded hover:bg-neutral-100"
                    onClick={handleNextMonth}
                >
                    <ChevronRight className="h-4 w-4 text-neutral-500" />
                </Button>
            </div>

            <div className="flex gap-2">
                <Select
                    value={month.toString()}
                    onValueChange={(val) => setMonth(parseInt(val))}
                >
                    <SelectTrigger className="w-[130px] h-10">
                        <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                        {MONTHS.map((m, idx) => (
                            <SelectItem key={idx} value={(idx + 1).toString()}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={year.toString()}
                    onValueChange={(val) => setYear(parseInt(val))}
                >
                    <SelectTrigger className="w-[100px] h-10">
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default YearAndMonthSelector;
