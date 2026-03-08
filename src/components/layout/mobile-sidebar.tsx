'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardNav } from '@/components/dashboard-nav';
import { getNavItemsByRole } from '@/lib/utils';
import { useUser } from '@/context/user-context';

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const { user } = useUser();

    const role = user?.role;
    const navItems = role ? getNavItemsByRole(role) : getNavItemsByRole('admin');

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-100">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold">TG</span>
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 text-sm">TransGo</p>
                            <p className="text-xs text-neutral-500">Dashboard</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 overflow-hidden">
                        <DashboardNav items={navItems} setOpen={setOpen} isMobileNav={true} />
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400 text-center">
                            TransGo Dashboard v1.0
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
