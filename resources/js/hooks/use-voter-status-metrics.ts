import { useMemo } from "react";
import type { DashboardVoterStats } from "@/components/dashboard/types";

type VoterStatusKey = "approved" | "pending" | "rejected";

type VoterStatusChartItem = {
	status: VoterStatusKey;
	label: string;
	count: number;
	fill: string;
};

type VoterStatusListItem = {
	key: VoterStatusKey;
	label: string;
	value: number;
	percentage: number;
	fill: string;
};

export default function useVoterStatusMetrics(voters: DashboardVoterStats) {
	return useMemo(() => {
		const totalVoters = voters.total;
		const approvalRate = totalVoters > 0 ? Math.round((voters.approved / totalVoters) * 100) : 0;
		const pendingRate = totalVoters > 0 ? Math.round((voters.pending / totalVoters) * 100) : 0;
		const rejectionRate = totalVoters > 0 ? Math.round((voters.rejected / totalVoters) * 100) : 0;

		const voterStatusData: VoterStatusChartItem[] = [
			{ status: "approved", label: "Disetujui", count: voters.approved, fill: "blue" },
			{ status: "pending", label: "Menunggu", count: voters.pending, fill: "yellow" },
			{ status: "rejected", label: "Ditolak", count: voters.rejected, fill: "red" },
		];

		const statusList: VoterStatusListItem[] = [
			{ key: "approved", label: "Disetujui", value: voters.approved, percentage: approvalRate, fill: "bg-emerald-600" },
			{
				key: "pending",
				label: "Menunggu Aktivasi",
				value: voters.pending,
				percentage: pendingRate,
				fill: "bg-yellow-300",
			},
			{ key: "rejected", label: "Ditolak", value: voters.rejected, percentage: rejectionRate, fill: "bg-red-600" },
		];

		return {
			totalVoters,
			approvalRate,
			pendingRate,
			rejectionRate,
			voterStatusData,
			statusList,
		};
	}, [voters]);
}
