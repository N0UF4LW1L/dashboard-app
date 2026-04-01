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
        roles: ['admin', 'finance'],
        items: [
            {
                title: 'Pesanan Kendaraan',
                href: '/dashboard/orders',
                icon: 'car',
                label: 'orders',
                roles: ['admin', 'finance'],
            },
        ],
    },
    {
        title: 'KATALOG',
        label: 'katalog',
        roles: ['admin'],
        items: [
            {
                title: 'Fleets',
                href: '/dashboard/vehicles',
                icon: 'car',
                label: 'vehicles',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'CUSTOMER MANAGEMENT',
        label: 'customer',
        roles: ['admin'],
        items: [
            {
                title: 'Customers',
                href: '/dashboard/customers',
                icon: 'users',
                label: 'Customers',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'SYSTEM OPERATIONAL',
        label: 'system-operational',
        roles: ['admin'],
        items: [
            {
                title: 'Location',
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
        ],
    },
    {
        title: 'OPERATIONAL',
        label: 'operational',
        roles: ['admin', 'finance', 'driver'],
        items: [
            {
                title: 'Reimburse',
                href: '/dashboard/reimburse',
                icon: 'hand',
                label: 'reimburse',
                roles: ['admin', 'finance','driver'],
            },
        ],
    },
    {
        title: 'FINANCIAL MANAGEMENT',
        label: 'financial-management',
        roles: ['admin', 'finance'],
        items: [
            {
                title: 'Rekap Pencatatan',
                href: '/dashboard/rekap-pencatatan',
                icon: 'fileText',
                label: 'rekap-pencatatan',
                roles: ['admin', 'finance'],
            },
            {
                title: 'Inventaris',
                href: '/dashboard/inventory',
                icon: 'clipboardList',
                label: 'inventory',
                roles: ['admin'],
            },
            {
                title: 'Realisasi',
                href: '/dashboard/realisasi',
                icon: 'pieChart',
                label: 'realisasi',
                roles: ['admin', 'finance'],
            },
            {
                title: 'Perencanaan',
                href: '/dashboard/perencanaan',
                icon: 'chart',
                label: 'perencanaan',
                roles: ['admin', 'finance'],
            },
        ],
    },
];
