import React from "react";
import LeftColumnItem from "./left-column-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ICalendarData } from "./types";

const LeftColumn = ({
    vehicles,
    isFetching,
}: {
    vehicles: ICalendarData[];
    isFetching: boolean;
}) => {
    return (
        <div className="left-0 sticky z-40 bg-white border-r">
            <div className="sticky left-0 bg-white w-[250px] lg:w-[324px]">
                <div className="top-0 sticky border-b border-r border-neutral-200 h-[50px] flex w-full bg-white z-50">
                    <p className="flex items-center py-[12px] px-[20px] text-neutral-700 font-medium text-[14px] leading-6">
                        Nama Kendaraan / Armada
                    </p>
                </div>

                {vehicles.map((vehicle, index) => (
                    <LeftColumnItem
                        key={vehicle.id}
                        vehicle={vehicle}
                        isLast={index === vehicles.length - 1}
                    />
                ))}

                {isFetching && (
                    <div className="flex flex-col space-y-2 p-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                className="h-[40px] w-full rounded-md"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftColumn;
