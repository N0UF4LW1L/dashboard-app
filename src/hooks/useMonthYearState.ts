import { create } from "zustand";

interface MonthYearStore {
    month: number;
    year: number;
    setMonth: (month: number) => void;
    setYear: (year: number) => void;
    searchQuery: string;
    setSearchQuery: (searchQuery: string) => void;
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
    handlePrevYear: () => void;
    handleNextYear: () => void;
    currentMonth: () => Date;
}

export const useMonthYearState = create<MonthYearStore>((set, get) => ({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    setMonth: (month) => set({ month }),
    setYear: (year) => set({ year }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    handlePrevMonth: () =>
        set((state) => {
            return { month: state.month === 1 ? 12 : state.month - 1 };
        }),
    handleNextMonth: () =>
        set((state) => {
            return { month: state.month === 12 ? 1 : state.month + 1 };
        }),
    handlePrevYear: () =>
        set((state) => {
            return { year: state.year - 1 };
        }),
    handleNextYear: () =>
        set((state) => {
            return { year: state.year + 1 };
        }),
    currentMonth: (): Date => {
        const { month, year } = get();
        const monthIndex = month - 1;
        return new Date(year, monthIndex, 1);
    },
}));
