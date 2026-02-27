import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { navItems } from "@/constants/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNavItemsByRole(role?: string) {
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role || 'admin'),
  );

  const navItemsWithFilteredSubItems = filteredNavItems.map((item) => {
    if (item.items) {
      return {
        ...item,
        items: item.items.filter((subItem) =>
          subItem.roles.includes(role || 'admin'),
        ),
      };
    }
    return item;
  });

  return navItemsWithFilteredSubItems.filter((item) => {
    if (item.items) {
      return item.items.length > 0;
    }
    return true;
  });
}

export function formatRupiah(number: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatDate(date?: string | Date, withTime = false): string {
  if (!date) return '-';
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' }),
  };
  return new Intl.DateTimeFormat('id-ID', options).format(d);
}
