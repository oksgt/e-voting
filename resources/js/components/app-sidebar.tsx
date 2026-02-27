import { Link } from "@inertiajs/react";
import { BookOpenCheck, LayoutGrid, Notebook, Tags, UsersRound } from "lucide-react";
import { route } from "ziggy-js";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: "Events",
        href: route("events.index"),
        icon: BookOpenCheck,
    },
    // {
    //     title: 'Users',
    //     href: route('users.index'),
    //     icon: UsersRound,
    // },
    {
        title: "Voter/Pemilih",
        href: route("voters.index"),
        icon: UsersRound,
    },
    {
        title: "Posisi",
        href: route("positions.index"),
        icon: Tags,
    },
    {
        title: "User Roles",
        href: route("roles.index"),
        icon: Notebook,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
