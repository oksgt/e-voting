import { CheckCircle2, Clock3, Users2, XCircle } from "lucide-react";
import type { DashboardSectionProps } from "@/components/dashboard/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VoterSummaryCards({ voters }: DashboardSectionProps) {
    const totalVoters = voters.total;
    const approvalRate = totalVoters > 0 ? Math.round((voters.approved / totalVoters) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Ringkasan Data Voter</CardTitle>
                <CardDescription>
                    Pantau status voter secara real-time untuk memastikan proses e-voting berjalan lancar.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}
