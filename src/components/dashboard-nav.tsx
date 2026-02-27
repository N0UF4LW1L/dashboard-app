'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { useOrdersStatusCount } from '@/hooks/api/use-order';
import { useCustomersStatusCount } from '@/hooks/api/use-customer';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardNavProps {
    items: NavItem[];
    setOpen?: Dispatch<SetStateAction<boolean>>;
    isMobileNav?: boolean;
}

export function DashboardNav({
    items,
    setOpen,
    isMobileNav = false,
}: DashboardNavProps) {
    const path = usePathname();
    const { isMinimized, toggle } = useSidebar();

    const { data: orderStatusCount } = useOrdersStatusCount();
    const { data: customerStatusCount } = useCustomersStatusCount();

    const orderCount = orderStatusCount?.data;
    const customerCount = customerStatusCount?.data;

    const navItems = useMemo(() => [...items], [items]);

    const isSubActive = (href?: string) => {
        if (!href) return false;
        if (href === '/dashboard') return path === '/dashboard';
        return path.startsWith(href);
    };

    if (!navItems?.length) return null;

    return (
        <nav className="flex flex-col" style={{ height: '100%' }}>
            {/* Toggle header */}
            <div className={cn(
                'flex items-center rounded-md text-sm font-medium p-3',
                !isMinimized ? 'justify-between' : 'justify-center',
            )}>
                {(!isMinimized || isMobileNav) && (
                    <span className="mr-2 truncate font-semibold text-lg">Menu</span>
                )}
                <div
                    className="border border-neutral-200 p-2 bg-neutral-50 rounded-md cursor-pointer flex-shrink-0"
                    onClick={toggle}
                >
                    {isMinimized ? (
                        <ChevronLast className="h-4 w-4" />
                    ) : (
                        <ChevronFirst className="h-4 w-4" />
                    )}
                </div>
            </div>

            {/* Nav items */}
            <div className="overflow-y-auto flex-1">
                <div className="grid items-start gap-1 pb-10 px-1">
                    {navItems.map((item, index) => {
                        const Icon = Icons[item.icon || 'arrowRight'];

                        // ── MINIMIZED: icon only ──
                        if (isMinimized && !isMobileNav) {
                            if (item.items && item.items.length > 0) {
                                return (
                                    <div key={index} className="flex flex-col items-center gap-0.5">
                                        {item.items.map((subItem, subIndex) => {
                                            const SubIcon = Icons[subItem.icon || 'arrowRight'];
                                            const active = isSubActive(subItem.href);
                                            return (
                                                <Tooltip key={subIndex}>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={subItem.href || '#'}
                                                            onClick={() => setOpen?.(false)}
                                                        >
                                                            <div className={cn(
                                                                'w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                                                                active ? 'bg-[#EDEFF3] text-[#1F61D9]' : '',
                                                            )}>
                                                                <SubIcon className="h-4 w-4" />
                                                            </div>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p>{subItem.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                        <div className="my-1 h-px w-8 bg-neutral-200" />
                                    </div>
                                );
                            }
                            // single item minimized
                            if (!item.href) return null;
                            const active = isSubActive(item.href);
                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Link href={item.href} onClick={() => setOpen?.(false)}>
                                            <div className={cn(
                                                'w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                                                active ? 'bg-[#EDEFF3] text-[#1F61D9]' : '',
                                            )}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{item.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        // ── EXPANDED: normal mode ──
                        if (item.items && item.items.length > 0) {
                            return (
                                <div key={index}>
                                    {/* Group header */}
                                    <div className={cn(
                                        'flex items-center rounded-md p-3 text-sm font-medium text-[#1F61D9]',
                                        item.disabled && 'cursor-not-allowed opacity-80',
                                    )}>
                                        <Icon className="h-4 w-4" />
                                        <span className="ml-2 mr-2 truncate">{item.title}</span>
                                    </div>
                                    {/* Sub items */}
                                    <div className="ml-4 space-y-0.5">
                                        {item.items.map((subItem, subIndex) => {
                                            const SubIcon = Icons[subItem.icon || 'arrowRight'];
                                            const active = isSubActive(subItem.href);
                                            return (
                                                <Link
                                                    key={subIndex}
                                                    href={subItem.href || '#'}
                                                    onClick={() => setOpen?.(false)}
                                                >
                                                    <div className={cn(
                                                        'flex items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                                                        active ? 'bg-[#EDEFF3] text-[#1F61D9]' : '',
                                                        subItem.disabled && 'cursor-not-allowed opacity-80',
                                                    )}>
                                                        <SubIcon className="h-4 w-4 flex-shrink-0" />
                                                        <div className="flex items-center justify-between w-full min-w-0">
                                                            <span className="ml-2 truncate">{subItem.title}</span>
                                                            <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                                                {subItem.title === 'Pesanan Kendaraan' && (
                                                                    <span className="bg-red-500 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center rounded-md text-white px-1">
                                                                        {orderCount?.[0]?.count ?? 0}
                                                                    </span>
                                                                )}
                                                                {subItem.title === 'Pelanggan' && (
                                                                    <span className="bg-red-500 text-xs font-medium min-w-[20px] h-5 flex items-center justify-center rounded-md text-white px-1">
                                                                        {customerCount?.[0]?.count ?? 0}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        // single item expanded
                        if (!item.href) return null;
                        const active = isSubActive(item.href);
                        return (
                            <Link key={index} href={item.href} onClick={() => setOpen?.(false)}>
                                <span className={cn(
                                    'flex items-center rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                                    active ? 'bg-[#EDEFF3] text-[#1F61D9]' : '',
                                    item.disabled && 'cursor-not-allowed opacity-80',
                                )}>
                                    <Icon className="h-4 w-4" />
                                    <span className="ml-2 truncate">{item.title}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
