import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { route } from "ziggy-js";
import * as z from "zod";
import { formatNowa } from "@/lib/string";
import type { AnggotaKoperasi } from "@/types/anggota-koperasi";

const anggotaKoperasiSchema = z.object({
	nama: z.string().min(1, "Nama wajib diisi.").max(255, "Nama maksimal 255 karakter."),
	nik: z.string().min(1, "NIK wajib diisi.").max(20, "NIK maksimal 20 karakter."),
	bidang: z.string().min(1, "Bidang wajib dipilih."),
	nowa: z.string().min(1, "Nomor WhatsApp wajib diisi.").max(20, "Nomor WhatsApp maksimal 20 karakter."),
});

export type AnggotaKoperasiFormValues = z.infer<typeof anggotaKoperasiSchema>;

export const useAnggotaKoperasiForm = (anggota?: AnggotaKoperasi) => {
	const isCreating = !anggota;

	const form = useForm<AnggotaKoperasiFormValues>({
		resolver: zodResolver(anggotaKoperasiSchema),
		defaultValues: {
			nama: anggota?.nama ?? "",
			nik: anggota?.nik ?? "",
			bidang: anggota?.bidang ?? "",
			nowa: anggota?.nowa ?? "",
		},
	});

	const onSubmit = (values: AnggotaKoperasiFormValues): Promise<void> =>
		new Promise((resolve) => {
			const [method, routeName, successMessage] = isCreating
				? (["post", "anggota-koperasi.store", "Anggota koperasi berhasil ditambahkan!"] as const)
				: (["put", "anggota-koperasi.update", "Anggota koperasi berhasil diperbarui!"] as const);

			const destination = isCreating ? route(routeName) : route(routeName, anggota?.id);
			const newValues = { ...values, nowa: formatNowa(values.nowa) };

			router[method](destination, newValues as unknown as Record<string, string>, {
				onSuccess: () => {
					toast.success(successMessage, {
						style: { backgroundColor: "green", color: "white" },
					});
				},
				onError: (serverErrors) => {
					Object.entries(serverErrors).forEach(([key, message]) => {
						form.setError(key as keyof AnggotaKoperasiFormValues, { message: message as string });
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
