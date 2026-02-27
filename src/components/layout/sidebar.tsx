'use client';

import { DashboardNav } from '@/components/dashboard-nav';
import { cn, getNavItemsByRole } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUser } from '@/context/user-context';

type SidebarProps = {
    className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
    const { isMinimized } = useSidebar();
    const { user } = useUser();

    const role = user?.role;
    const navItems = role ? getNavItemsByRole(role) : getNavItemsByRole('admin');

    return (
        <nav
            className={cn(
                'relative hidden h-screen flex-none border-r z-10 pt-20 md:block transition-all duration-300 overflow-hidden',
                !isMinimized ? 'w-72' : 'w-[64px]',
                className,
            )}
        >
            <DashboardNav items={navItems} />
        </nav>
    );
}
