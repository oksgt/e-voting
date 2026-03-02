import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { route } from "ziggy-js";
import * as z from "zod";
import type { Bidang } from "@/types/bidang";

const bidangSchema = z.object({
	nama_bidang: z.string().min(1, "Nama bidang wajib diisi.").max(100, "Nama bidang maksimal 100 karakter."),
});

export type BidangFormValues = z.infer<typeof bidangSchema>;

export const useBidangForm = (bidang?: Bidang) => {
	const isCreating = !bidang;

	const form = useForm<BidangFormValues>({
		resolver: zodResolver(bidangSchema),
		defaultValues: {
			nama_bidang: bidang?.nama_bidang ?? "",
		},
	});

	const onSubmit = (values: BidangFormValues): Promise<void> =>
		new Promise((resolve) => {
			const [method, routeName, successMessage] = isCreating
				? (["post", "bidang.store", "Bidang berhasil ditambahkan!"] as const)
				: (["put", "bidang.update", "Bidang berhasil diperbarui!"] as const);

			const destination = isCreating ? route(routeName) : route(routeName, bidang?.id);

			router[method](destination, values as unknown as Record<string, string>, {
				onSuccess: () => {
					toast.success(successMessage, {
						style: { backgroundColor: "green", color: "white" },
					});
				},
				onError: (serverErrors) => {
					Object.entries(serverErrors).forEach(([key, message]) => {
						form.setError(key as keyof BidangFormValues, { message: message as string });
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
