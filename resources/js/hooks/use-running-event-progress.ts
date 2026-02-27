import { useMemo } from "react";
import type { RunningEventCardProps } from "@/components/dashboard/types";

type EventItem = RunningEventCardProps["electionEvents"][number];

type EventCategory = "finished" | "running" | "upcoming";

const getEventTimeProgress = (event: EventItem, now: number) => {
	if (event.status === "finished" || event.status === "cancelled") return 100;

	const finishedAt = event.finished_at ? new Date(event.finished_at).getTime() : null;
	if (finishedAt !== null && now >= finishedAt) return 100;

	if (event.status !== "running") return 0;

	const startedAt = event.started_at ? new Date(event.started_at).getTime() : null;
	if (startedAt === null || finishedAt === null || finishedAt <= startedAt) return 0;

	if (now <= startedAt) return 0;

	const progress = ((now - startedAt) / (finishedAt - startedAt)) * 100;
	return Math.max(0, Math.min(100, progress));
};

const getEventCategory = (event: EventItem, now: number): EventCategory => {
	if (event.status === "finished" || event.status === "cancelled") return "finished";

	const finishedAt = event.finished_at ? new Date(event.finished_at).getTime() : null;
	if (finishedAt !== null && now >= finishedAt) return "finished";

	if (event.status === "running") return "running";

	return "upcoming";
};

export default function useRunningEventProgress(electionEvents: RunningEventCardProps["electionEvents"]) {
	return useMemo(() => {
		const now = Date.now();
		const totalEvents = electionEvents.length;

		const sortedElectionEvents = [...electionEvents]
			.map((event) => ({
				event,
				category: getEventCategory(event, now),
			}))
			.sort((left, right) => {
				const categoryOrder: Record<EventCategory, number> = {
					finished: 0,
					running: 1,
					upcoming: 2,
				};

				if (categoryOrder[left.category] !== categoryOrder[right.category]) {
					return categoryOrder[left.category] - categoryOrder[right.category];
				}

				const leftTime = left.event.finished_at ? new Date(left.event.finished_at).getTime() : 0;
				const rightTime = right.event.finished_at ? new Date(right.event.finished_at).getTime() : 0;

				return rightTime - leftTime;
			});

		const finishedCount = electionEvents.filter((event) => {
			if (event.status === "finished" || event.status === "cancelled") return true;
			if (!event.finished_at) return false;

			return now >= new Date(event.finished_at).getTime();
		}).length;

		const runningCount = electionEvents.filter((event) => event.status === "running").length;
		const upcomingCount = electionEvents.filter(
			(event) => event.status === "pending" || event.status === "scheduled",
		).length;

		const totalProgressPoint = electionEvents.reduce((acc, event) => acc + getEventTimeProgress(event, now), 0);
		const overallProgress = totalEvents > 0 ? Math.round(totalProgressPoint / totalEvents) : 0;

		const finishedProgressPoint = electionEvents.reduce((acc, event) => {
			const progress = getEventTimeProgress(event, now);
			return progress >= 100 ? acc + 100 : acc;
		}, 0);

		const runningProgressPoint = electionEvents.reduce((acc, event) => {
			const progress = getEventTimeProgress(event, now);

			if (progress > 0 && progress < 100) {
				return acc + progress;
			}

			return acc;
		}, 0);

		const runningAverageProgress = runningCount > 0 ? Math.round(runningProgressPoint / runningCount) : 0;
		const finishedCardPercentage = finishedCount > 0 ? 100 : 0;
		const upcomingCardPercentage = 0;

		const finishedPercentage = totalEvents > 0 ? Math.round((finishedProgressPoint / (totalEvents * 100)) * 100) : 0;
		const runningPercentage = totalEvents > 0 ? Math.round((runningProgressPoint / (totalEvents * 100)) * 100) : 0;
		const upcomingPercentage = Math.max(0, 100 - finishedPercentage - runningPercentage);

		const progressItems = [
			{
				key: "finished",
				label: "Selesai",
				count: finishedCount,
				percentage: finishedCardPercentage,
				barPercentage: finishedPercentage,
				barClassName: "bg-primary",
			},
			{
				key: "running",
				label: "Berjalan",
				count: runningCount,
				percentage: runningAverageProgress,
				barPercentage: runningPercentage,
				barClassName: "bg-secondary",
			},
			{
				key: "upcoming",
				label: "Akan Datang",
				count: upcomingCount,
				percentage: upcomingCardPercentage,
				barPercentage: upcomingPercentage,
				barClassName: "bg-accent",
			},
		] as const;

		return {
			overallProgress,
			progressItems,
			sortedElectionEvents,
		};
	}, [electionEvents]);
}
