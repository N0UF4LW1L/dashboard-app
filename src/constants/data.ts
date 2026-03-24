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
                title: 'Fleet',
                href: '/dashboard/vehicles',
                icon: 'truck',
                label: 'vehicles',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'CUSTOMER MANAGEMENT',
        label: 'extra',
        roles: ['admin'],
        items: [
            {
                title: 'Customers',
                href: '/dashboard/customers',
                icon: 'users',
                label: 'customers',
                roles: ['admin'],
            }
        ],
    },
    {
        title: 'SYSTEM OPERATIONAL',
        label: 'system-ops',
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
                title: 'Add-Ons',
                href: '/dashboard/addons',
                icon: 'plus', 
                label: 'addons',
                roles: ['admin'],
            },
        ],
    },
    {
        title: 'OPERATIONAL',
        label: 'operational',
        roles: ['admin', 'driver'],
        items: [
            {
                title: 'Reimburse',
                href: '/dashboard/reimburse',
                icon: 'hand',
                label: 'reimburse',
                roles: ['admin', 'driver'],
            },
        ],
    },
    {
        title: 'FINANCIAL MANAGEMENT',
        label: 'financial',
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
                href: '/dashboard/inventaris',
                icon: 'clipboardList',
                label: 'inventaris',
                roles: ['admin', 'finance'],
            },
        ],
    },
];
