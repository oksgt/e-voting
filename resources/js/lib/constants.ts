import { CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { route } from "ziggy-js";
import type { BreadcrumbItem } from "@/types";

export const breadcrumbs: BreadcrumbItem[] = [{ title: "Voter", href: route("voters.index") }];

export const STATUS_CONFIG: Record<string, { text: string; className: string }> = {
	approved: { text: "approved", className: "bg-green-100 text-green-800 border-green-200" },
	pending: { text: "pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
	rejected: { text: "rejected", className: "bg-red-100 text-red-800 border-red-200" },
};

export const STAT_CARD_CONFIGS = [
	{
		key: null as string | null,
		label: "Total Voter",
		countKey: "total" as const,
		icon: Users,
		color: "text-blue-600",
		bg: "bg-blue-50 dark:bg-blue-950/30",
		border: "border-blue-200 dark:border-blue-800",
		activeBorder: "border-blue-500",
	},
	{
		key: "pending" as string | null,
		label: "Pending",
		countKey: "pending" as const,
		icon: Clock,
		color: "text-yellow-600",
		bg: "bg-yellow-50 dark:bg-yellow-950/30",
		border: "border-yellow-200 dark:border-yellow-800",
		activeBorder: "border-yellow-500",
	},
	{
		key: "approved" as string | null,
		label: "Approved",
		countKey: "approved" as const,
		icon: CheckCircle2,
		color: "text-green-600",
		bg: "bg-green-50 dark:bg-green-950/30",
		border: "border-green-200 dark:border-green-800",
		activeBorder: "border-green-500",
	},
	{
		key: "rejected" as string | null,
		label: "Rejected",
		countKey: "rejected" as const,
		icon: XCircle,
		color: "text-red-600",
		bg: "bg-red-50 dark:bg-red-950/30",
		border: "border-red-200 dark:border-red-800",
		activeBorder: "border-red-500",
	},
] as const;

export const BIDANG_OPTIONS = [
	"DEWAN PENGAWAS",
	"DIREKTORAT UTAMA",
	"DIREKTORAT TEKNIK",
	"DIREKTORAT ADMIN & KEUANGAN",
	"BAG. PERENCANAAN & PENGEMBANGAN",
	"BAG. PRODUKSI & DISTRIBUSI 1",
	"BAG. PRODUKSI & DISTRIBUSI 2",
	"BAG. PENGENDALIAN TEKNIK",
	"BAG. KEUANGAN",
	"BAG. KESEKRETARIATAN",
	"BAG. SUMBER DAYA MANUSIA & TI",
	"BAG. PERLENGKAPAN",
	"SATUAN PENGAWAS INTERN",
	"CABANG PURWOKERTO 1",
	"CABANG PURWOKERTO 2",
	"CABANG AJIBARANG",
	"CABANG WANGON",
	"CABANG BANYUMAS",
	"UNIT BISNIS AMDK",
] as const;
