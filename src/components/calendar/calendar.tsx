"use client";

import React, { useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useCalendarViewStore } from "@/hooks/components/useCalendarViewStore";
import LeftColumn from "./left-column";
import Header from "./header";
import Grid from "./grid";
import { useMonthYearState } from "@/hooks/useMonthYearState";
import { Skeleton } from "@/components/ui/skeleton";

const Calendar = () => {
    const { month, year } = useMonthYearState();
    const { calendarData, isFetching } = useCalendarViewStore();

    const now = dayjs(`${year}-${month}-01`);
    const start = now.startOf("month");
    const end = now.endOf("month");

    const dates: Dayjs[] = [];
    const today = dayjs().format("YYYY-MM-DD");

    for (
        let date = start;
        date.isBefore(end) || date.isSame(end, "day");
        date = date.add(1, "day")
    ) {
        dates.push(date);
    }

    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll otomatis ke hari ini saat awal render
        const timer = setTimeout(() => {
            if (document && tableRef.current) {
                const todayColumn = document.querySelector(`[data-date='${today}']`) as HTMLElement;
                if (todayColumn) {
                    const offsetLeft = todayColumn.offsetLeft;
                    const containerWidth = tableRef.current.offsetWidth;
                    tableRef.current.scrollTo({
                        left: offsetLeft - containerWidth / 2 + todayColumn.offsetWidth / 2,
                        behavior: "smooth"
                    });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [today, month, year]);

    return (
        <div
            className="border overflow-hidden border-neutral-200 rounded-lg max-h-[800px] bg-white relative"
        >
            <div
                ref={tableRef}
                className="flex max-h-[800px] overflow-auto h-full w-full custom-scrollbar"
            >
                <LeftColumn vehicles={calendarData} isFetching={isFetching} />

                <div className="flex-1 w-max">
                    <Header dates={dates} />

                    <div className="min-w-max">
                        <Grid dates={dates} data={calendarData} />

                        {isFetching && (
                            <div className="flex flex-col space-y-2 p-[12px]">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="flex flex-row gap-[2px]">
                                        {dates.map((date) => (
                                            <Skeleton
                                                key={`s-${date.format("YYYY-MM-DD")}`}
                                                className="h-[40px] w-[62px] rounded-md shrink-0"
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
