import dayjs from "dayjs";
import { formatRupiah } from "@/lib/utils";
import { ICalendarData } from "@/components/calendar/types";
import { useGetVehicles } from "@/hooks/api/use-vehicle";
import { useGetOrders } from "@/hooks/api/use-order";
import { useMonthYearState } from "@/hooks/useMonthYearState";

const getOrderStatus = (order: any, isReturned: boolean) => {
    if (isReturned) return 'selesai';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(order.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(order.endDate);
    end.setHours(0, 0, 0, 0);

    if (start > today) return 'menunggu';
    if (end < today) return 'selesai';
    return 'berjalan';
};

export const useCalendarViewStore = () => {
    const { month, year, searchQuery } = useMonthYearState();

    const { data: vehicles = [], isLoading: isLoadingVehicles } = useGetVehicles();
    const { data: orders = [], isLoading: isLoadingOrders } = useGetOrders();

    const isFetching = isLoadingVehicles || isLoadingOrders;

    // Gabungkan orders ke vehicles mereka (Group By Vehicle)
    let mappedData: ICalendarData[] = vehicles.map((vehicle: any) => {
        // Filter orders specific to this vehicle
        const vehicleOrders = orders.filter((order: any) => order.vehicleId === vehicle.id);

        return {
            id: vehicle.id,
            name: vehicle.name,
            location: vehicle.type, // type as location placeholder
            price: vehicle.rentalPrice ? formatRupiah(vehicle.rentalPrice) : "Rp 0",
            image: "https://via.placeholder.com/150", // placeholder image since our entity has no photo
            usage: vehicleOrders.map((order: any) => {
                return {
                    id: order.id,
                    start: dayjs(order.startDate),
                    end: dayjs(order.endDate),
                    startDriver: order.customer?.name || "Customer",
                    endDriver: order.customer?.name || "Customer",
                    duration: (order.rentalDays || 0) + " hari",
                    paymentStatus: order.paymentStatus || "Belum Lunas",
                    orderStatus: getOrderStatus(order, order.isReturned),
                    title: order.customer?.name || "Customer",
                    price: order.totalPrice ? formatRupiah(order.totalPrice) : "Rp 0",
                };
            }),
        };
    });

    // Filter berdasarkan search query
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        mappedData = mappedData.filter(v => v.name.toLowerCase().includes(q));
    }

    // Tambahkan skeleton empty data jika kurang dari 5 agar UI penuh minimal 5 baris
    if (!isFetching && mappedData.length < 5) {
        const emptyCount = 5 - mappedData.length;
        for (let i = 0; i < emptyCount; i++) {
            // @ts-ignore
            mappedData.push({
                id: `empty-${i}`,
                name: "",
                location: "",
                price: "",
                image: "",
                usage: [],
            });
        }
    }

    return {
        calendarData: mappedData,
        isFetching,
        // Pagination attributes (mocked since frontend data is fully loaded)
        hasNextPage: false,
        fetchNextPage: () => { },
        isFetchingNextPage: false,
    };
};
