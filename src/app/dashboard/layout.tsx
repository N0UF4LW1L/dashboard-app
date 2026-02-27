import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { SidebarProvider } from '@/hooks/use-sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | TransGo',
    description: 'Dashboard page',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Header />
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 min-w-0 pt-16 overflow-y-scroll">{children}</main>
            </div>
        </SidebarProvider>
    );
}
