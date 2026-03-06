import React from "react";
import { HoverCardContent } from "@/components/ui/hover-card";
import { ICalendarData } from "./types";

const TooltipFleet = ({ data }: { data: ICalendarData }) => {
    return (
        <HoverCardContent align="start" className="w-[300px] h-full p-[12px] z-999 bg-white text-black">
            <div className="flex flex-row items-center gap-[12px]">
                <div className="w-[100px] h-[100px] p-[4px]">
                    <div
                        className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                    >
                        {/* Foto armada dummy */}
                        NO PIC
                    </div>
                </div>
                <div className="flex flex-col gap-[10px] mr-[16px]">
                    <p className="text-[18px] font-semibold leading-5">{data.name}</p>
                    <div className="flex flex-col gap-[2px]">
                        <p className="text-[14px] font-semibold leading-5 text-gray-800">
                            {data.price} / hari
                        </p>
                        <p className="text-[14px] font-normal leading-5 text-gray-600">{data.location}</p>
                    </div>
                </div>
            </div>
        </HoverCardContent>
    );
};

export default TooltipFleet;
