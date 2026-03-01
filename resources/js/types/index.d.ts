import type { InertiaLinkProps } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import type { Permission } from "./permission";
import type { Role } from "./role";

export interface Auth {
	user: User;
}

export interface BreadcrumbItem {
	title: string;
	href: string;
}

export interface NavGroup {
	title: string;
	items: NavItem[];
}

export interface NavItem {
	title: string;
	href: NonNullable<InertiaLinkProps["href"]>;
	icon?: LucideIcon | null;
	isActive?: boolean;
}

export interface SharedData {
	name: string;
	quote: { message: string; author: string };
	auth: Auth;
	sidebarOpen: boolean;
	error?: string | string[];
	[key: string]: unknown;
}

export interface User {
	id: number;
	name: string;
	nik: string;
	email: string;
	avatar?: string;
	email_verified_at: string | null;
	two_factor_enabled?: boolean;
	created_at: string;
	updated_at: string;
	status: "pending" | "rejected" | "approved";
	bidang: string | null;
	nik: string | null;
	phone_number: string | null;
	login_method: "password" | "magic_link" | "both";
	whatsapp_active: boolean;
	permissions: Permission[];
	roles: Role[];
	[key: string]: unknown; // This allows for additional properties...
}

interface PaginationLink {
	first: string | null;
	last: string | null;
	prev: string | null;
	next: string | null;
}

export interface PaginationMetaLink {
	active: boolean;
	label: string;
	page: number | null;
	url: string | null;
}

export interface PaginationMeta {
	current_page: number;
	from: number;
	last_page: number;
	links: PaginationMetaLink[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface Pagination<T> {
	data: T[];
	links: PaginationMetaLink[];
	meta: PaginationMeta & { links: PaginationLink };
}

export interface BaseFilter {
	per_page?: number;
	sort_by?: string;
	sort_direction?: string;
	search?: string;
}
