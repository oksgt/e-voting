import { ShieldCheck } from "lucide-react";
import type { RunningEventCardProps } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dateToString } from "@/lib/utils";

const statusLabelMap = {
    pending: "secondary",
    scheduled: "secondary",
    running: "default",
    finished: "outline",
    cancelled: "destructive",
} as const;

const getEventTimeProgress = (event: RunningEventCardProps["electionEvents"][number], now: number) => {
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

export default function RunningEventCard({ runningEvent, electionEvents }: RunningEventCardProps) {
    const now = Date.now();
    const totalEvents = electionEvents.length;
    const finishedCount = electionEvents.filter((event) => {
        if (event.status === "finished" || event.status === "cancelled") return true;

        if (!event.finished_at) return false;

        return now >= new Date(event.finished_at).getTime();
    }).length;
    const runningCount = electionEvents.filter((event) => event.status === "running").length;
    const upcomingCount = electionEvents.filter((event) => event.status === "pending" || event.status === "scheduled").length;

    const totalProgressPoint = electionEvents.reduce((acc, event) => acc + getEventTimeProgress(event, now), 0);
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5" />
                    Progress Event
                </CardTitle>
                <CardDescription>Persentase event selesai, berjalan, dan akan datang.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                {electionEvents.length === 0 ? (
                    <p className="text-muted-foreground">Belum ada event.</p>
                ) : (
                    <>
                        <div className="space-y-3">
                            <div className="bg-muted flex h-2 w-full overflow-hidden rounded-full">
                                {progressItems.map((item) =>
                                    item.barPercentage > 0 ? (
                                        <div className={item.barClassName} key={item.key} style={{ width: `${item.barPercentage}%` }} />
                                    ) : null,
                                )}
                            </div>

                            <p className="text-muted-foreground text-xs">Progress keseluruhan: {Math.round(totalProgressPoint / totalEvents)}%</p>

                            <div className="grid gap-2 sm:grid-cols-3">
                                {progressItems.map((item) => (
                                    <div className="rounded-md border px-2 py-1" key={`legend-${item.key}`}>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {item.percentage}% ({item.count})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-3">
                            <p className="text-muted-foreground text-xs">Daftar Event</p>
                            {electionEvents.map((event) => (
                                <div className="rounded-lg border p-3" key={`list-${event.id}`}>
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="font-medium">{event.name}</p>
                                        <Badge variant={statusLabelMap[event.status]}>{event.status}</Badge>
                                    </div>
                                    <div className="text-muted-foreground grid gap-1 text-xs">
                                        <p>Mulai: {dateToString(event.started_at)}</p>
                                        <p>Selesai: {dateToString(event.finished_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {runningEvent && (
                    <Badge className="w-fit" variant="default">
                        Event aktif: {runningEvent.name}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
}
