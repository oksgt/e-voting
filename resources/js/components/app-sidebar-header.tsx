import { Link, router } from "@inertiajs/react";
import { LogOut } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { logout } from "@/routes";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";
import AppearanceToggleDropdown from "./appearance-dropdown";
import { Button } from "./ui/button";

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <header className="flex h-16 shrink-0 items-center 
                            justify-between border-b 
                            border-sidebar-border/50 px-6 
                            transition-[width,height] ease-linear 
                            group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 
                            md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <AppearanceToggleDropdown />
                <Button variant="ghost" size="icon" className="text-red-500" asChild>
                    <Link href={logout()} as="button" onClick={handleLogout} data-test="logout-button">
                        <LogOut />
                    </Link>
                </Button>
            </div>

        </header>
    );
}
