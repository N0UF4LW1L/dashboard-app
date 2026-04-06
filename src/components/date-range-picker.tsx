"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { useMonthYearState } from "@/hooks/useMonthYearState";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface CalendarDateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateRangeChange: (range: any) => void;
  onClearDate: () => void;
  dateRange: any;
  numberOfMonths?: number;
  disableNavigation?: boolean;
  showOutsideDays?: boolean;
  useDefaultMonth?: boolean;
}

export const CalendarDateRangePicker: React.FC<
  CalendarDateRangePickerProps
> = ({
  className,
  onDateRangeChange,
  dateRange,
  onClearDate,
  numberOfMonths = 2,
  disableNavigation = false,
  showOutsideDays = true,
}) => {
  const [date, setDate] = React.useState<DateRange>(dateRange);

  const { currentMonth } = useMonthYearState();

  React.useEffect(() => {
    setDate(dateRange);
  }, [dateRange]);

  const handleDateChange = (range: any) => {
    setDate(range);
    onDateRangeChange(range);
  };

  return (
    <div className={cn("grid gap-2 w-full lg:!w-auto", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full lg:!w-[260px] justify-start text-left font-normal relative",
              !date && "text-muted-foreground",
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Tanggal</span>
            )}
            <div className="absolute right-0 ">
              {date?.from && date?.to ? (
                <X
                  className="mr-2 h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearDate();
                  }}
                />
              ) : (
                <CalendarIcon className="mr-2 h-4 w-4" />
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || currentMonth()}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={numberOfMonths}
            disableNavigation={disableNavigation}
            showOutsideDays={showOutsideDays}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
