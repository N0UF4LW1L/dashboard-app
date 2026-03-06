import React from "react";
import dayjs from "dayjs";

import { HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { ORDER_STATUS, PAYMENT_STATUS } from "./utils";
import { IUsage } from "./types";

import "dayjs/locale/id";
dayjs.locale("id");

const TooltipDate = ({ data }: { data: IUsage }) => {
    return (
        <HoverCardContent
            align="start"
            className="w-[300px] h-full p-[12px] flex flex-col gap-[10px] bg-white z-999"
            sideOffset={5}
        >
            <div className="pl-[16px] pt-[6px] flex flex-col gap-[6px]">
                <div className="flex flex-row items-center justify-between">
                    <p className="leading-5 font-semibold text-[18px]">{data.price}</p>
                    <div
                        className={`${PAYMENT_STATUS[data.paymentStatus]
                            ?.bgColor} ${PAYMENT_STATUS[data.paymentStatus]
                                ?.color} font-medium leading-5 text-[14px] py-[6px] px-2 rounded-lg`}
                    >
                        {PAYMENT_STATUS[data.paymentStatus]?.text}
                    </div>
                </div>

                <div className="flex flex-col gap-[2px]">
                    <p className="text-[14px] leading-5 font-medium">{data.title}</p>
                    <div className="flex flex-row items-center gap-[4px]">
                        <div
                            className={`h-[12px] w-[12px] rounded-full ${ORDER_STATUS[
                                data.orderStatus
                            ]?.bgColorDarker}`}
                        />
                        <p className="text-[14px] leading-5 font-normal">
                            {ORDER_STATUS[data.orderStatus]?.text}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border border-neutral-200 rounded-lg py-[16px] px-[12px] w-full h-full flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[6px]">
                    <p className="text-[12px] leading-4 font-normal text-[#64748B]">
                        Pelanggan & Tanggal Pengambilan
                    </p>
                    <p className="text-[14px] leading-5 font-medium mb-[2px]">
                        {data.startDriver}
                    </p>
                    <div className="flex flex-row h-4 gap-[8px] items-center">
                        <p className="text-[12px] leading-4 font-medium">
                            {data.start.format("dddd, DD MMMM YYYY")}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-[6px]">
                    <p className="text-[12px] leading-4 font-normal text-[#64748B]">
                        Pelanggan & Tanggal Pengembalian
                    </p>
                    <p className="text-[14px] leading-5 font-medium mb-[2px]">
                        {data.endDriver}
                    </p>
                    <div className="flex flex-row h-4 items-center gap-[8px]">
                        <p className="text-[12px] leading-4 font-medium">
                            {data.end.format("dddd, DD MMMM YYYY")}
                        </p>
                    </div>
                </div>
            </div>
        </HoverCardContent>
    );
};

export default TooltipDate;
