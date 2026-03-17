import { NavItem } from '@/types';

export const navItems: NavItem[] = [
    {
        title: 'DASHBOARD',
        label: 'Dashboard',
        roles: ['admin', 'finance', 'driver'],
        items: [
            {
                title: 'Data',
                href: '/dashboard',
                icon: 'dashboard',
                label: 'Dashboard',
                roles: ['admin', 'finance', 'driver'],
            },
            {
                title: 'Calendar',
                href: '/dashboard/calendar',
                icon: 'calendar',
                label: 'Calendar',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'PESANAN',
        label: 'orders',
        roles: ['admin'],
        items: [
            {
                title: 'Pesanan Kendaraan',
                href: '/dashboard/orders',
                icon: 'car',
                label: 'orders',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'KATALOG',
        label: 'catalog',
        roles: ['admin'],
        items: [
            {
                title: 'Kendaraan',
                href: '/dashboard/vehicles',
                icon: 'truck',
                label: 'vehicles',
                roles: ['admin'],
            },
            {
                title: 'Pelanggan',
                href: '/dashboard/customers',
                icon: 'users',
                label: 'customers',
                roles: ['admin'],
            },
            {
                title: 'Lokasi',
                href: '/dashboard/location',
                icon: 'home',
                label: 'location',
                roles: ['admin'],
            },
            {
                title: 'Add-ons',
                href: '/dashboard/addons',
                icon: 'package',
                label: 'addons',
                roles: ['admin'],
            },
            {
                title: 'Inventaris',
                href: '/dashboard/inventory',
                icon: 'clipboardList',
                label: 'inventory',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'FITUR TAMBAHAN',
        label: 'extra',
        roles: ['admin', 'finance', 'driver'],
        items: [
            {
                title: 'Rekap Pencatatan',
                href: '/dashboard/rekap-pencatatan',
                icon: 'fileText',
                label: 'rekap-pencatatan',
                roles: ['admin', 'finance'],
            },
            {
                title: 'Reimburse',
                href: '/dashboard/reimburse',
                icon: 'hand',
                label: 'reimburse',
                roles: ['admin', 'driver'],
            },
        ],
    },
];
