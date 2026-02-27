import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { route } from "ziggy-js";
import * as z from "zod";
import type { User } from "@/types";

const baseObjectSchema = z.object({
	name: z.string().min(1, "Name is required.").max(255),
	nik: z
		.string()
		.refine((v) => v === "" || v.length === 16, "NIK must be exactly 16 digits.")
		.refine((v) => v === "" || /^\d+$/.test(v), "NIK must contain only digits.")
		.optional(),
	bidang: z.string().max(255).optional(),
	phone_number: z.string().max(20).optional(),
	email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
	login_method: z.enum(["password", "magic_link", "both"]),
	password: z.string().optional(),
	password_confirmation: z.string().optional(),
	roles: z.array(z.string()).min(1, "At least one role must be selected."),
});

export type FormValues = z.infer<typeof baseObjectSchema>;

const buildSchema = (isCreating: boolean) =>
	baseObjectSchema.superRefine((data, ctx) => {
		if (["password", "both"].includes(data.login_method)) {
			const passwordRequired = isCreating
				? !data.password || data.password.length < 8
				: !!data.password && data.password.length < 8;
			if (passwordRequired) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["password"],
					message: "Password must be at least 8 characters.",
				});
			}
			if (data.password && data.password !== data.password_confirmation) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["password_confirmation"],
					message: "Password confirmation does not match.",
				});
			}
		}
	});

export const useVoterForm = (user?: User, userRoles?: string[]) => {
	const isCreating = !user;

	const form = useForm<FormValues>({
		resolver: zodResolver(buildSchema(isCreating)),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			nik: user?.nik || "",
			phone_number: user?.phone_number || "",
			bidang: (user?.bidang as string) || "",
			login_method: (user?.login_method as "password" | "magic_link" | "both") || "magic_link",
			password: "",
			password_confirmation: "",
			roles: userRoles ?? ["Voter"],
		},
	});

	const loginMethod = form.watch("login_method");

	const onSubmit = (values: FormValues): Promise<void> =>
		new Promise((resolve) => {
			const [method, routeName, successMessage] = isCreating
				? (["post", "voters.store", "Voter created successfully!"] as const)
				: (["put", "voters.update", "Voter updated successfully!"] as const);

			const routeArgs = isCreating ? route(routeName) : route(routeName, user?.id);

			router[method](routeArgs, values as unknown as Record<string, string>, {
				onSuccess: () => {
					toast.success(successMessage, {
						style: { backgroundColor: "green", color: "white" },
					});
				},
				onError: (serverErrors) => {
					Object.entries(serverErrors).forEach(([key, message]) => {
						form.setError(key as keyof FormValues, { message: message as string });
					});
				},
				onFinish: () => resolve(),
			});
		});

	const handleCheckboxChange = (role: string, checked: boolean) => {
		const currentRoles = form.getValues("roles");
		const newRoles = checked ? [...currentRoles, role] : currentRoles.filter((r: string) => r !== role);
		form.setValue("roles", newRoles, { shouldValidate: true });
	};

	const handleToggleGroup = (rolesList: string[], selectAll: boolean) => {
		const currentRoles = form.getValues("roles");
		const filtered = currentRoles.filter((r: string) => !rolesList.includes(r));
		const newRoles = selectAll ? [...filtered, ...rolesList] : filtered;
		form.setValue("roles", newRoles, { shouldValidate: true });
	};

	return {
		form,
		loginMethod,
		onSubmit,
		handleCheckboxChange,
		handleToggleGroup,
	};
};
