import { useEffect, useState } from "react"
import { RefreshCw, TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Separator } from "radix-ui"
import { SelectSeparator } from "@radix-ui/react-select"
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

export const description = "Pie chart penjaringan event 3"

const chartConfig = {
    value: { label: "Persentase" },
} satisfies ChartConfig

export function ChartPenjaringan() {
    const [chartData, setChartData] = useState<any[]>([])
    const [lastUpdated, setLastUpdated] = useState<string>("")

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
        }).format(date)
    }


    useEffect(() => {
        fetch("/api/chart-penjaringan/3")
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    const item = data[0]
                    const mapped = [
                        {
                            name: Number(item.persentase),
                            value: Number(item.persentase),
                            fill: "#3b82f6", // Tailwind blue-500
                        },
                        {
                            name: Number(item.sisa),
                            value: Number(item.sisa),
                            fill: "#DEEDFE", // Tailwind blue-300 (lebih muda)
                        },
                    ]
                    setChartData(mapped)
                    setLastUpdated(formatTimestamp(new Date()))
                }
            })
    }, [])

    const totalPersentase = chartData.length > 0 ? chartData[0].value : 0

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex items-center justify-between pb-0">
                <div className="flex flex-col">
                    <CardTitle>Grafik Penjaringan</CardTitle>
                    <CardDescription>
                        Data per: {lastUpdated || "Memuat..."}
                    </CardDescription>
                </div>
                <button
                    onClick={() => {
                        fetch("/api/chart-penjaringan/3")
                            .then((res) => res.json())
                            .then((data) => {
                                if (data.length > 0) {
                                    const item = data[0]
                                    const mapped = [
                                        {
                                            name: "Ikut",
                                            value: Number(item.persentase),
                                            fill: "#3b82f6", // biru utama
                                        },
                                        {
                                            name: "Belum Ikut",
                                            value: Number(item.sisa),
                                            fill: "#DEEDFE", // biru muda
                                        },
                                    ]
                                    setChartData(mapped)
                                }
                            })
                    }}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Reload chart"
                >
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                </button>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="value" hideLabel />}
                        />
                        <Pie data={chartData} dataKey="value">
                            <LabelList
                                dataKey="name"
                                stroke="none"
                                fontSize={12}
                                style={{ fill: "black", fontWeight: "bold" }} // hitam + bold
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <CardFooter className="flex flex-col gap-4 text-center">
                    {chartData.length > 0 && (
                        <>
                            <div className="flex justify-around w-full gap-3">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {chartData[0].value}%
                                    </span>
                                    <span className="text-sm text-gray-900 font-semibold">Sudah memilih</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {chartData[1].value}%
                                    </span>
                                    <span className="text-sm text-gray-500">Belum memilih</span>
                                </div>
                            </div>
                            <SelectSeparator />
                            <div className="flex items-center justify-center mt-2 gap-4">
                                <span className="text-lg font-semibold text-gray-900 ">
                                    Top 2 penjaringan per posisi
                                </span>
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <div className="flex w-full max-w-md flex-col gap-6">
                                    <Item variant="outline">
                                        <ItemMedia variant="icon">
                                            <u />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>Default Size</ItemTitle>
                                            <ItemDescription>
                                                The standard size for most use cases.
                                            </ItemDescription>
                                        </ItemContent>
                                    </Item>
                                    <Item variant="outline" size="sm">
                                        <ItemMedia variant="icon">
                                            <u />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>Small Size</ItemTitle>
                                            <ItemDescription>A compact size for dense layouts.</ItemDescription>
                                        </ItemContent>
                                    </Item>
                                    <Item variant="outline" size="xs">
                                        <ItemMedia variant="icon">
                                            <u />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>Extra Small Size</ItemTitle>
                                            <ItemDescription>The most compact size available.</ItemDescription>
                                        </ItemContent>
                                    </Item>
                                </div>
                            </div>
                        </>
                    )}
                </CardFooter>
            </CardFooter>
        </Card>
    )
}
