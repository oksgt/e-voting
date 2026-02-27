import { ShieldCheck } from "lucide-react";
import type { RunningEventCardProps } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useRunningEventProgress from "@/hooks/use-running-event-progress";
import { dateToString } from "@/lib/utils";

const categoryBadgeClassMap = {
    finished: "border-transparent bg-emerald-600 text-white",
    running: "border-transparent bg-amber-500 text-black",
    upcoming: "border-transparent bg-secondary text-secondary-foreground",
} as const;

const categoryLabelMap = {
    finished: "Selesai",
    running: "Berjalan",
    upcoming: "Akan Datang",
} as const;

export default function RunningEventCard({ runningEvent, electionEvents }: RunningEventCardProps) {
    const { overallProgress, progressItems, sortedElectionEvents } = useRunningEventProgress(electionEvents);

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
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <p className="text-muted-foreground">Progress keseluruhan</p>
                                    <p className="font-medium">{overallProgress}%</p>
                                </div>
                                <Progress className="[&_[data-slot=progress-indicator]]:bg-emerald-600" value={overallProgress} showPing />
                            </div>

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
                            {sortedElectionEvents.map(({ event, category }) => {

                                return (
                                    <div className="rounded-lg border p-3" key={`list-${event.id}`}>
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <p className="font-medium">{event.name}</p>
                                            <Badge className={categoryBadgeClassMap[category]}>{categoryLabelMap[category]}</Badge>
                                        </div>
                                        <div className="text-muted-foreground grid gap-1 text-xs">
                                            <p>Mulai: {dateToString(event.started_at)}</p>
                                            <p>Selesai: {dateToString(event.finished_at)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {runningEvent && (
                    <Badge className={`w-fit ${categoryBadgeClassMap.running}`}>
                        Event aktif: {runningEvent.name}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
}
