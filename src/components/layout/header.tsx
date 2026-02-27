import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Link from 'next/link';

export default function Header() {
    return (
        <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
            <nav className="h-14 flex items-center justify-between px-4">
                <div className={cn('block lg:!hidden')}>
                    <MobileSidebar />
                </div>

                <div className="hidden lg:block">
                    <Link href="/dashboard">
                        <span className="font-bold text-xl text-[#1F61D9]">TransGo</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <UserNav />
                </div>
            </nav>
        </div>
    );
}
