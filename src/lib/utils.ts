import { APP_CONFIG } from "@/constants/app";
import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatDate = (
	timestamp: { seconds: number; nanoseconds: number } | Date | string | undefined | null,
) => {
	if (!timestamp) return "—";

	if (typeof timestamp === "string") {
		return format(parseISO(timestamp), "dd MMM yyyy HH:mm");
	}

	if (timestamp instanceof Date) {
		return format(timestamp, "dd MMM yyyy HH:mm");
	}

	return format(new Date(timestamp.seconds * 1000), "dd MMM yyyy HH:mm");
};

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");
}

export function truncateText(text: string, maxLength: number, suffix = "..."): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - suffix.length).trim() + suffix;
}

export function formatNumber(num: number, locale = APP_CONFIG.DEFAULT_LANGUAGE): string {
	return new Intl.NumberFormat(locale).format(num);
}

export function debounce<T extends (...args: TAny[]) => TAny>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function throttle<T extends (...args: TAny[]) => TAny>(
	func: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

export function isExternalLink(url: string): boolean {
	if (!url) return false;
	return url.startsWith("http") || url.startsWith("//");
}

export function getDomain(url: string): string {
	try {
		const domain = new URL(url).hostname;
		return domain.replace(/^www\./, "");
	} catch (e) {
		return url;
	}
}

export function generateMetaTitle(title: string): string {
	return title ? `${title} | ${APP_CONFIG.SITE_NAME}` : APP_CONFIG.SITE_NAME;
}
