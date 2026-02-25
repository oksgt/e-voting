import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

type AppSidebarLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
}>;

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppSidebarLayoutProps) {
    const { auth } = usePage().props as { auth?: { roles?: string[] } };
    const roles = auth?.roles || [];

    // gunakan toLowerCase agar aman terhadap case-sensitive
    const canSeeSidebar = roles.some(
        (role) => role.toLowerCase() === "admin"
    );

    return (
        <AppShell variant="sidebar">
            {canSeeSidebar && <AppSidebar />}
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
