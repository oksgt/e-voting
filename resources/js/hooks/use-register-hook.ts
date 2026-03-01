import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { decryptNik } from "@/lib/crypto";
import type { AnggotaKoperasi } from "@/types/anggota-koperasi";
import type { Bidang } from "@/types/bidang";

type PhoneValidationStatus = "idle" | "validating" | "valid" | "invalid" | "error";

export function useRegisterHook() {
	const [options, setOptions] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [anggotaOptions, setAnggotaOptions] = useState<string[]>([]);
	const [anggotaList, setAnggotaList] = useState<AnggotaKoperasi[]>([]);
	const [isLoadingAnggota, setIsLoadingAnggota] = useState(false);
	const anggotaControllerRef = useRef<AbortController | null>(null);

	const [phoneValidationStatus, setPhoneValidationStatus] = useState<PhoneValidationStatus>("idle");
	const [phoneValidationMessage, setPhoneValidationMessage] = useState<string>("");
	const phoneControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		const loadBidang = async () => {
			try {
				const response = await fetch("/api/bidang", { signal: controller.signal });
				if (!response.ok) {
					return;
				}

				const payload = (await response.json()) as Bidang[] | { data?: Bidang[] };
				const data = Array.isArray(payload) ? payload : (payload.data ?? []);
				const bidangNames = data
					.map((item) => item.nama_bidang?.trim())
					.filter((value): value is string => Boolean(value));

				setOptions(bidangNames);
			} catch (error) {
				if ((error as Error).name !== "AbortError") {
					setOptions([]);
				}
			} finally {
				setIsLoading(false);
			}
		};

		loadBidang();

		return () => {
			controller.abort();
		};
	}, []);

	const uniqueOptions = useMemo(() => Array.from(new Set(options)), [options]);

	const fetchAnggota = async (bidang: string) => {
		anggotaControllerRef.current?.abort();

		if (!bidang.trim()) {
			setAnggotaOptions([]);
			return;
		}

		const controller = new AbortController();
		anggotaControllerRef.current = controller;
		setIsLoadingAnggota(true);

		try {
			const response = await fetch(`/api/anggota?bidang=${encodeURIComponent(bidang)}`, {
				signal: controller.signal,
			});

			if (!response.ok) {
				return;
			}

			const payload = (await response.json()) as AnggotaKoperasi[] | { data?: AnggotaKoperasi[] };
			const data = Array.isArray(payload) ? payload : (payload.data ?? []);
			const decryptedData = data.map((item) => ({
				...item,
				nik: item.nik ? decryptNik(item.nik) : item.nik,
			}));
			setAnggotaList(decryptedData);
			const names = decryptedData.map((item) => item.nama?.trim()).filter((value): value is string => Boolean(value));

			setAnggotaOptions(Array.from(new Set(names)));
		} catch (error) {
			if ((error as Error).name !== "AbortError") {
				setAnggotaOptions([]);
			}
		} finally {
			setIsLoadingAnggota(false);
		}
	};

	const onBidangChange = useDebouncedCallback((value: string) => {
		fetchAnggota(value);
	}, 300);

	useEffect(() => {
		return () => {
			anggotaControllerRef.current?.abort();
		};
	}, []);

	const findDetailByName = (name: string): AnggotaKoperasi | undefined => {
		const anggota = anggotaList.find((item) => item.nama?.trim() === name.trim());
		return anggota;
	};

	const formatNowa = (value: string): string => {
		const sanitized = value.trim();

		if (sanitized.startsWith("0")) {
			return `62${sanitized.slice(1)}`;
		}

		return sanitized;
	};

	const validatePhoneNumber = async (phone: string) => {
		phoneControllerRef.current?.abort();

		if (!phone.trim() || phone.length < 10) {
			setPhoneValidationStatus("idle");
			setPhoneValidationMessage("");
			return;
		}

		const controller = new AbortController();
		phoneControllerRef.current = controller;
		setPhoneValidationStatus("validating");
		setPhoneValidationMessage("Memvalidasi nomor...");

		try {
			const response = await fetch(`/api/check-phone-number/${encodeURIComponent(phone)}`, {
				method: "POST",
				signal: controller.signal,
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// const errorData = await response.json().catch(() => ({}));
				// setPhoneValidationStatus("error");
				// setPhoneValidationMessage(errorData.error || "Gagal memvalidasi nomor");

                setPhoneValidationStatus("valid");
				return;
			}

			const data = await response.json();

			if (data.registered === true) {
				setPhoneValidationStatus("valid");
				setPhoneValidationMessage("Nomor terdaftar di WhatsApp");
			} else {
				setPhoneValidationStatus("valid");
				// setPhoneValidationMessage("Nomor tidak terdaftar di WhatsApp");
			}
		} catch (error) {
			if ((error as Error).name !== "AbortError") {
				setPhoneValidationStatus("error");
				setPhoneValidationMessage("Terjadi kesalahan saat memvalidasi");
			}
		}
	};

	const debouncedValidatePhone = useDebouncedCallback(validatePhoneNumber, 800);

	const onNowaChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const formattedValue = formatNowa(event.target.value);

		if (formattedValue !== event.target.value) {
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
			nativeInputValueSetter?.call(event.target, formattedValue);
			event.target.dispatchEvent(new Event("input", { bubbles: true }));
		}

		debouncedValidatePhone(formattedValue);
	};

	useEffect(() => {
		return () => {
			phoneControllerRef.current?.abort();
		};
	}, []);

	return {
		options: uniqueOptions,
		isLoading,
		onBidangChange,
		onNowaChange,
		anggotaOptions,
		isLoadingAnggota,
		findDetailByName,
		phoneValidationStatus,
		phoneValidationMessage,
	};
}
