import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { route } from "ziggy-js";
import * as z from "zod";
import type { Position } from "@/types/position";

const positionSchema = z.object({
	name: z.string().min(1, "Position name is required.").max(100, "Position name must be 100 characters or less."),
	description: z.string().max(500, "Description must be 500 characters or less.").optional().or(z.literal("")),
	status: z.enum(["active", "not active"]),
});

export type PositionFormValues = z.infer<typeof positionSchema>;

export const usePositionForm = (position?: Position) => {
	const isCreating = !position;

	const form = useForm<PositionFormValues>({
		resolver: zodResolver(positionSchema),
		defaultValues: {
			name: position?.name ?? "",
			description: position?.description ?? "",
			status: position?.status === 1 ? "active" : "not active",
		},
	});

	const onSubmit = (values: PositionFormValues): Promise<void> =>
		new Promise((resolve) => {
			const [method, routeName, successMessage] = isCreating
				? (["post", "positions.store", "Position created successfully!"] as const)
				: (["put", "positions.update", "Position updated successfully!"] as const);

			const destination = isCreating ? route(routeName) : route(routeName, position?.id);

			router[method](destination, values as unknown as Record<string, string>, {
				onSuccess: () => {
					toast.success(successMessage, {
						style: { backgroundColor: "green", color: "white" },
					});
				},
				onError: (serverErrors) => {
					Object.entries(serverErrors).forEach(([key, message]) => {
						form.setError(key as keyof PositionFormValues, { message: message as string });
					});
				},
				onFinish: () => resolve(),
			});
		});

	return {
		form,
		onSubmit,
	};
};
