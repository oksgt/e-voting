import { InertiaLinkProps } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function resolveUrl(url: NonNullable<InertiaLinkProps["href"]>) {
	return typeof url === "string" ? url : url.url;
}

export function isSameUrl(
	url1: NonNullable<InertiaLinkProps["href"]>,
	url2: NonNullable<InertiaLinkProps["href"]>,
) {
	return resolveUrl(url1) === resolveUrl(url2);
}

export const dateToString = (date?: string | null) => {
	if (!date || date === null) return "";

	const dateObj = new Date(date);
	return dateObj.toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	});
};
