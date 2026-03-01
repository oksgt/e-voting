import { useEffect, useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

export const description = "Pie chart penjaringan event";

const chartConfig = {
    value: { label: "Persentase" },
} satisfies ChartConfig;

type ChartPenjaringanProps = {
    event_id: number;
    value_type?: "number" | null;
};

export function ChartPenjaringan({ event_id, value_type = null }: ChartPenjaringanProps) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const formatTimestamp = (date: Date) =>
        new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
        }).format(date);

    const unit = value_type === "number" ? "Orang" : "%";

    // Fungsi fetch data
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/chart-penjaringan/${event_id}/${value_type}`);
            const data = await res.json();

            if (data.length > 0) {
                const item = data[0];
                let mapped: any[] = [];

                if (value_type === "number") {
                    mapped = [
                        {
                            name: Number(item.jumlah_user_ikut) + " " +unit,
                            value: Number(item.jumlah_user_ikut),
                            fill: "#3b82f6", // Tailwind blue-500
                        },
                        {
                            name: Number(item.sisa) + " " +unit,
                            value: Number(item.sisa),
                            fill: "#DEEDFE", // Tailwind blue-300
                        },
                    ];
                } else {
                    mapped = [
                        {
                            name: Number(item.persentase) + " " +unit,
                            value: Number(item.persentase),
                            fill: "#3b82f6",
                        },
                        {
                            name: Number(item.sisa) + " " +unit,
                            value: Number(item.sisa),
                            fill: "#DEEDFE",
                        },
                    ];
                }

                setChartData(mapped);
                setLastUpdated(formatTimestamp(new Date()));
            }
        } catch (err) {
            console.error("Error fetching chart data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Panggil loadData saat mount / dependency berubah
    useEffect(() => {
        loadData();
    }, [event_id, value_type]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex items-center justify-between pb-0">
                <div className="flex flex-col">
                    <CardTitle>
                        {value_type === "number" ? "Jumlah Pemilih" : "Persentase"} Grafik Penjaringan
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Data per: {lastUpdated || "Memuat..."}
                    </CardDescription>
                </div>
                <button
                    onClick={loadData}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Reload chart"
                >
                    <RefreshCw
                        className={`h-5 w-5 text-blue-600 transition-transform ${loading ? "animate-spin" : ""
                            }`}
                    />
                </button>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                        <Pie data={chartData} dataKey="value">
                            <LabelList
                                dataKey="name"
                                stroke="none"
                                fontSize={12}
                                style={{ fill: "black", fontWeight: "bold" }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                {chartData.length > 0 && (
                    <div className="flex justify-around w-full gap-3">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-blue-600">
                                {chartData[0].value} {unit}
                            </span>
                            <span className="text-sm text-gray-900 font-semibold">Sudah memilih</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-gray-800">
                                {chartData[1].value} {unit}
                            </span>
                            <span className="text-sm text-gray-500">Belum memilih</span>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
