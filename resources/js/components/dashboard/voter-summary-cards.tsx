import { BarChart3, CheckCircle2, Clock3, Users2, XCircle } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import type { DashboardSectionProps } from "@/components/dashboard/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import useVoterStatusMetrics from "@/hooks/use-voter-status-metrics";

const voterStatusConfig = {
    count: {
        label: "Voter",
    },
    approved: {
        label: "Disetujui",
        color: "var(--chart-1)",
    },
    pending: {
        label: "Menunggu",
        color: "var(--chart-2)",
    },
    rejected: {
        label: "Ditolak",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

export default function VoterSummaryCards({ voters }: DashboardSectionProps) {
    const { totalVoters, approvalRate, voterStatusData, statusList } = useVoterStatusMetrics(voters);

    const statusIconMap = {
        approved: CheckCircle2,
        pending: Clock3,
        rejected: XCircle,
    } as const;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Ringkasan Data Voter</CardTitle>
                <CardDescription>
                    Ringkasan total voter beserta detail distribusi status secara real-time.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Total Terdaftar</CardDescription>
                            <CardTitle className="text-3xl">{totalVoters}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Users2 className="h-4 w-4" />
                            Total voter dalam sistem
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Voter Disetujui</CardDescription>
                            <CardTitle className="text-3xl">{voters.approved}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            Tingkat persetujuan {approvalRate}%
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Menunggu Aktivasi</CardDescription>
                            <CardTitle className="text-3xl">{voters.pending}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Clock3 className="h-4 w-4" />
                            Perlu verifikasi WhatsApp
                        </CardContent>
                    </Card>

                    <Card className="border-border/60">
                        <CardHeader className="pb-2">
                            <CardDescription>Voter Ditolak</CardDescription>
                            <CardTitle className="text-3xl">{voters.rejected}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4" />
                            Butuh tindak lanjut admin
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 rounded-xl border p-4 lg:grid-cols-2">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                            <BarChart3 className="h-4 w-4" />
                            Detail Distribusi Status
                        </div>
                        <ChartContainer config={voterStatusConfig} className="mx-auto aspect-square max-h-[260px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
                                <Pie data={voterStatusData} dataKey="count" nameKey="label" innerRadius={60} outerRadius={90}>
                                    {voterStatusData.map((entry) => (
                                        <Cell key={entry.status} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>

                    <div className="space-y-4">
                        {statusList.map((item) => {
                            const StatusIcon = statusIconMap[item.key];

                            return (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <StatusIcon className="h-4 w-4" />
                                            {item.label}
                                        </div>
                                        <Badge variant="secondary">{item.value} voter</Badge>
                                    </div>
                                    <Progress value={item.percentage} className={`[&_[data-slot=progress-indicator]]:${item.fill}`} />
                                    <p className="text-muted-foreground text-xs">{item.percentage}% dari total voter</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
