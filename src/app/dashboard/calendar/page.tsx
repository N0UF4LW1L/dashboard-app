import React from "react";
import { Metadata } from "next";
import Calendar from "@/components/calendar/calendar";
import { Heading } from "@/components/ui/heading";
import YearAndMonthSelector from "@/components/calendar/year-and-month-selector";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Calendar | Dashboard",
    description: "Kalender ketersediaan kendaraan",
};

const CalendarPage = () => {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative min-h-[calc(100vh-64px)] overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Heading title="Kalender Armada" description="Pantau ketersediaan kendaraan dan jadwalnya hari ini." />
                <YearAndMonthSelector />
            </div>

            <Separator />

            <Calendar />
        </div>
    );
};

export default CalendarPage;
