import React from "react";
import dayjs, { Dayjs } from "dayjs";
import Tooltip from "./tooltip";
import { ORDER_STATUS } from "./utils";
import { ICalendarData } from "./types";

const DAY_WIDTH = 64;
const BOX_HEIGHT = 40;

const Grid = ({
    dates,
    data,
}: {
    dates: dayjs.Dayjs[];
    data: ICalendarData[];
}) => {
    const todayStr = dayjs().format("YYYY-MM-DD");

    const getDayOffset = (date: string) => {
        return dates.findIndex((d) => d.format("YYYY-MM-DD") === date);
    };

    const getTimeOffset = (startTime: Dayjs, endTime: Dayjs) => {
        const totalHours = endTime.diff(startTime, "hour", true);
        // Ensure minimum 1 hour for same-day returns
        return Math.max(totalHours, 1);
    };

    const handleOrderClick = (orderId: string | number) => {
        window.open(`/dashboard/orders/${orderId}/edit`, "_blank");
    };

    const handleOffsets = (
        startOffset: number,
        endOffset: number,
        startTime: Dayjs,
        endTime: Dayjs,
        totalHours: number,
    ) => {
        if (startOffset === -1 && endOffset === -1) {
            return null;
        } else if (endOffset === -1) {
            const endOfMonth = startTime.endOf("month");
            const hoursInCurrentMonth = endOfMonth.diff(startTime, "hour", true);
            return (hoursInCurrentMonth / 24) * DAY_WIDTH;
        } else if (startOffset === -1) {
            startOffset = 0;
            const startOfMonth = endTime.startOf("month");
            const hoursInCurrentMonth = endTime.diff(startOfMonth, "hour", true);
            return (hoursInCurrentMonth / 24) * DAY_WIDTH;
        } else {
            // Ensure minimum width for same-day returns
            // Fix: Some orders have only dates, not time, so endTime - startTime might be 0 hours if same day. Use minimum 24 hour width for day grid.
            const calculatedWidth = (totalHours / 24) * DAY_WIDTH;
            return Math.max(calculatedWidth, DAY_WIDTH * 0.9); // Make it at least ~1 block wide
        }
    };

    return (
        <>
            {data.map((vehicle, rowIndex) => (
                <div key={rowIndex} className="flex relative items-center">
                    {dates.map((date, colIndex) => {
                        const isCurrentDate = date.format("YYYY-MM-DD") === todayStr;
                        const isLastRow = rowIndex === data.length - 1;
                        const isLastColumn = colIndex === dates.length - 1;

                        return (
                            <div
                                key={date.format("YYYY-MM-DD")}
                                className={`relative border-gray-300 bg-white first:border-l-0 h-[64px] p-[12px] w-16 shrink-0 ${isLastRow ? "border-b-0" : "border-b"
                                    } ${isCurrentDate ? "bg-blue-50/20" : ""} ${isLastColumn ? "border-r-0" : "border-r"
                                    }`}
                                data-date={date.format("YYYY-MM-DD")}
                            >
                                {isCurrentDate && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-0.5 z-20 h-full bg-blue-600"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {vehicle.usage.map((usage, usageIndex: number) => {
                        const startTime = usage.start.startOf('day'); // normalize to start of day
                        const endTime = usage.end.endOf('day');       // normalize to end of day to make visual block full

                        let startOffset = getDayOffset(startTime.format("YYYY-MM-DD"));
                        const endOffset = getDayOffset(endTime.format("YYYY-MM-DD"));

                        // Calculate hours between start day and end day
                        const totalHours = endTime.diff(startTime, "hour", true);

                        const width = handleOffsets(
                            startOffset,
                            endOffset,
                            startTime,
                            endTime,
                            totalHours,
                        );
                        if (width === null) return null;

                        // Determine rendering position
                        const renderStartOffset = startOffset === -1 ? 0 : startOffset;

                        // start hour offset is 0 if it starts at 00:00 (which it does via .startOf('day'))
                        const leftPos = renderStartOffset * DAY_WIDTH;

                        const orderStatusDef = ORDER_STATUS[usage.orderStatus] || ORDER_STATUS['pending'];

                        return (
                            <div
                                className={`absolute cursor-pointer rounded-lg z-10 hover:shadow-md transition-all ${orderStatusDef?.bgColor} ${orderStatusDef?.border}`}
                                key={usage.id}
                                style={{
                                    top: 12,
                                    left: startOffset === -1 ? -8 : leftPos,
                                    width: width,
                                    height: BOX_HEIGHT,
                                }}
                            >
                                <Tooltip type="date" data={usage}>
                                    <div
                                        className={`flex ${width <= 20 ? "" : "px-[10px]"
                                            } items-center justify-center h-full w-full`}
                                        onClick={() => handleOrderClick(usage.id)}
                                    >
                                        <span
                                            className={`truncate leading-5 font-medium text-[12px] ${orderStatusDef?.color}`}
                                        >
                                            {usage.title}
                                        </span>
                                    </div>
                                </Tooltip>
                            </div>
                        );
                    })}
                </div>
            ))}
        </>
    );
};

export default Grid;
