import { Dayjs } from "dayjs";

export interface IUsage {
    id: string | number;
    start: Dayjs;
    end: Dayjs;
    startDriver: string;
    endDriver: string;
    duration: string;
    paymentStatus: string;
    orderStatus: string;
    title: string;
    price: string;
}

export interface ICalendarData {
    id: string | number;
    name: string;
    location: string;
    price: string;
    image: string;
    usage: IUsage[];
}
