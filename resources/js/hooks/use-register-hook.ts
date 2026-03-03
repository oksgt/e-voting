import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { decryptNik } from "@/lib/crypto";
import { formatNowa } from "@/lib/string";
import type { AnggotaKoperasi } from "@/types/anggota-koperasi";
import type { Bidang } from "@/types/bidang";

type ValidationStatus = "idle" | "validating" | "valid" | "invalid" | "error";

export function useRegisterHook() {
	const [options, setOptions] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [anggotaOptions, setAnggotaOptions] = useState<string[]>([]);
	const [anggotaList, setAnggotaList] = useState<AnggotaKoperasi[]>([]);
	const [isLoadingAnggota, setIsLoadingAnggota] = useState(false);
	const anggotaControllerRef = useRef<AbortController | null>(null);

	const [nikValidationStatus, setNikValidationStatus] = useState<ValidationStatus>("idle");
	const [nikValidationMessage, setNikValidationMessage] = useState<string>("");

	const [phoneValidationStatus, setPhoneValidationStatus] = useState<ValidationStatus>("idle");
	const [phoneValidationMessage, setPhoneValidationMessage] = useState<string>("");

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

	const findDetailByNik = (nik: string): AnggotaKoperasi | undefined => {
		return anggotaList.find((item) => item.nik === nik);
	};

	const validateNik = (nik: string): void => {
		const trimmed = nik.trim();

		if (!trimmed) {
			setNikValidationStatus("idle");
			setNikValidationMessage("");
			return;
		}

		if (!/^\d+$/.test(trimmed)) {
			setNikValidationStatus("invalid");
			setNikValidationMessage("NIK harus berupa angka");
			return;
		}

		if (trimmed.length < 16) {
			setNikValidationStatus("invalid");
			setNikValidationMessage(`NIK harus 16 digit (${trimmed.length}/16)`);
			return;
		}

		const anggota = findDetailByNik(trimmed);
		if (anggota) {
			setNikValidationStatus("valid");
			setNikValidationMessage("NIK ditemukan dalam data anggota");
		} else {
			setNikValidationStatus("invalid");
			setNikValidationMessage("NIK tidak ditemukan dalam data anggota");
		}
	};

	const debouncedValidateNik = useDebouncedCallback(validateNik, 400);

	const onNikChange = (value: string): void => {
		const numericOnly = value.replace(/\D/g, "").slice(0, 16);
		debouncedValidateNik(numericOnly);
	};

	const validatePhoneNumber = (phone: string): void => {
		const trimmed = phone.trim();

		if (!trimmed) {
			setPhoneValidationStatus("idle");
			setPhoneValidationMessage("");
			return;
		}

		if (!/^\d+$/.test(trimmed)) {
			setPhoneValidationStatus("invalid");
			setPhoneValidationMessage("Nomor harus berupa angka");
			return;
		}

		// Format Indonesia: 08xx (10-13 digit) atau 628xx (11-15 digit)
		const isLocal = /^08\d{8,11}$/.test(trimmed);
		const isInternational = /^628\d{8,11}$/.test(trimmed);

		if (!isLocal && !isInternational) {
			setPhoneValidationStatus("invalid");
			setPhoneValidationMessage("Format nomor HP Indonesia tidak valid (08xx atau 628xx)");
			return;
		}

		setPhoneValidationStatus("valid");
		setPhoneValidationMessage("Format nomor valid");
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

	return {
		options: uniqueOptions,
		isLoading,
		onBidangChange,
		onNikChange,
		onNowaChange,
		anggotaOptions,
		isLoadingAnggota,
		nikValidationStatus,
		nikValidationMessage,
		phoneValidationStatus,
		phoneValidationMessage,
	};
}
