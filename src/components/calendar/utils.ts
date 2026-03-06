export const PAYMENT_STATUS: Record<string, any> = {
    "Belum Lunas": {
        text: "Belum Bayar",
        color: "text-red-900",
        bgColor: "bg-red-50",
    },
    "Lunas": {
        text: "Lunas",
        color: "text-green-900",
        bgColor: "bg-green-50",
    },
};

export const ORDER_STATUS: Record<string, any> = {
    "menunggu": {
        text: "Menunggu Berjalan",
        color: "text-yellow-900",
        bgColor: "bg-yellow-100",
        bgColorDarker: "bg-yellow-500",
        border: "hover:border hover:border-yellow-500",
    },
    "berjalan": {
        text: "Sedang Berjalan",
        color: "text-blue-900",
        bgColor: "bg-blue-50",
        bgColorDarker: "bg-blue-500",
        border: "hover:border hover:border-blue-500",
    },
    "selesai": {
        text: "Selesai",
        color: "text-green-900",
        bgColor: "bg-green-100",
        bgColorDarker: "bg-green-500",
        border: "hover:border hover:border-green-500",
    },
};

export const MONTHS = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];
