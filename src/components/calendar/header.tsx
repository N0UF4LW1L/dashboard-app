import React from "react";
import dayjs from "dayjs";

import "dayjs/locale/id";

const Header = ({ dates }: { dates: dayjs.Dayjs[] }) => {
    const today = dayjs().format("YYYY-MM-DD");

    return (
        <div className="sticky top-0 h-[50px] z-30 flex bg-white">
            {dates.map((date) => {
                const isCurrentDate = date.format("YYYY-MM-DD") === today;

                return (
                    <div
                        key={date.format("YYYY-MM-DD")}
                        className={`border-r border-b border-gray-300 first:border-l-0 flex items-center justify-center py-[10px] last:border-r-0 w-16 font-bold shrink-0 ${isCurrentDate ? "bg-[#1F61D9]" : "bg-white"
                            }`}
                        data-date={date.format("YYYY-MM-DD")}
                    >
                        <div className="flex flex-col">
                            <p
                                className={`${isCurrentDate ? "text-neutral-200" : "text-neutral-700"
                                    } text-center leading-4 font-medium text-[14px]`}
                            >
                                {date.format("DD")}
                            </p>
                            <p
                                className={`${isCurrentDate ? "text-neutral-200" : "text-neutral-500"
                                    } leading-[14px] font-normal text-[10px] uppercase`}
                            >
                                {date.locale("id").format("dddd")}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Header;
