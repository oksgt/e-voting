import { Link, router } from "@inertiajs/react";
import { CheckCircle2, Edit3, WandSparkles, XCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import { route } from "ziggy-js";
import DeleteButtonDialog from "@/components/commons/delete_button_dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { can } from "@/lib/can";
import magicLinks from "@/routes/magic-links";
import type { User } from "@/types";

interface TableActionProps {
    user: User;
    authUserId: number;
    voterId: number;
}

const TableAction = memo(({ user, authUserId, voterId }: TableActionProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleMagicLink = useCallback(async () => {
        setIsGenerating(true);
        try {
            const response = await fetch(magicLinks.generate(String(user.phone_number)).url, {
                method: "GET",
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to generate magic link");
            }
            const data = await response.json();
            await navigator.clipboard.writeText(data.url);
            toast.success("Magic link copied to clipboard!");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to generate magic link");
        } finally {
            setIsGenerating(false);
        }
    }, [user.phone_number]);

    const handleDelete = useCallback(() => {
        router.delete(route("voters.destroy", voterId), {
            onSuccess: () => {
                toast.success("Voter deleted successfully!", {
                    style: { backgroundColor: "green", color: "white" },
                });
            },
        });
    }, [voterId]);

    const handleApprove = useCallback(() => {
        router.patch(
            route("voters.approve", voterId),
            {},
            {
                onSuccess: () => toast.success("Voter approved!"),
                onError: () => toast.error("Failed to approve voter."),
            },
        );
    }, [voterId]);

    const handleReject = useCallback(() => {
        router.patch(
            route("voters.reject", voterId),
            {},
            {
                onSuccess: () => toast.success("Voter rejected."),
                onError: () => toast.error("Failed to reject voter."),
            },
        );
    }, [voterId]);

    return (
        <ButtonGroup>
            {can("voters.update") && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="text-blue-600 hover:text-blue-700" asChild>
                            <Link href={route("voters.edit", voterId)}>
                                <Edit3 className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit item</TooltipContent>
                </Tooltip>
            )}

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleMagicLink} disabled={isGenerating}>
                        <WandSparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Magic Link</TooltipContent>
            </Tooltip>

            {user.id !== authUserId && can("voters.delete") && <DeleteButtonDialog handleDelete={handleDelete} />}

            {can("voters.update") && user.status !== "approved" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600 hover:text-green-700"
                            onClick={handleApprove}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Approve</TooltipContent>
                </Tooltip>
            )}

            {can("voters.update") && user.status !== "rejected" && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700" onClick={handleReject}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reject</TooltipContent>
                </Tooltip>
            )}
        </ButtonGroup>
    );
});

TableAction.displayName = "TableAction";

export default TableAction;
