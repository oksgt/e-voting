import { PlayIcon } from "lucide-react";
import { memo } from "react";
import { dateToString } from "@/lib/utils";
import type { ElectionEvent } from "@/types/election_event";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";

interface CardBuilderProps {
    title: string;
    description: string;
    children: React.ReactNode;
}
const CardBuilder = memo<CardBuilderProps>(({ title, description, children }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
));
CardBuilder.displayName = "CardBuilder";

interface DashboardCardPanelProps {
    runningEvent: ElectionEvent | null;
}
const DashboardCardPanel = memo(({ runningEvent }: DashboardCardPanelProps) => {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <CardBuilder title="Running Event" description="List Running Event">
                <Item variant="outline">
                    <ItemMedia>
                        <PlayIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>{runningEvent?.name}</ItemTitle>
                        <ItemDescription>
                            <ul>
                                <li>Start at : {dateToString(runningEvent?.started_at)}</li>
                                <li>Finished at : {dateToString(runningEvent?.finished_at)}</li>
                            </ul>
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </CardBuilder>
        </div>
    );
});
DashboardCardPanel.displayName = "DashboardCardPanel";

export default DashboardCardPanel;
