const env = import.meta.env;

export const APP_CONFIG = {
	ITEMS_PER_PAGE: 10, // Pagination default
	STALE_TIME: 1000 * 60 * 5, // 5 minutes
	COPYRIGHT: "© 2025 Nanthakumar. All rights reserved.",
	VERSION: "1.0.0",
	SITE_NAME: "Nanthakumar",
	SITE_URL: "https://jjnanthakumar.github.io",
	SITE_DESCRIPTION: "Full-stack Developer & Python Specialist",
	DEFAULT_LANGUAGE: "en",
	DEFAULT_THEME: "system",
	DEFAULT_TIMEZONE: "UTC+05:00",
} as const;

export const SOCIAL_LINKS = [
	{ href: "https://github.com/jjnanthakumar", icon: "Github", label: "GitHub" },
	{ href: "https://x.com/jjnanthakumar", icon: "Twitter", label: "Twitter" },
	{ href: "https://linkedin.com/in/jjnanthakumar", icon: "Linkedin", label: "LinkedIn" },
] as const;

export const CONTACT_INFO = {
	EMAIL: "jjnanthakumar477@gmail.com",
	LOCATION: "Chennai, TamilNadu, India",
	TIMEZONE: "IST, UTC+05:00",
} as const;

export const SERVICE_RATES = {
	BASIC_HOURLY: 50,
	PROFESSIONAL_WEEKLY: 2000,
	CONSULTATION_HOURLY: 75,
} as const;

export const META_DEFAULTS = {
	TITLE_TEMPLATE: "%s | Nanthakumar",
	OG_IMAGE: "https://pub-2ab98e96400d470096cf10abb107a2c8.r2.dev/meta_data_folio_preview.png",
	TWITTER_HANDLE: "@jjnanthakumar",
} as const;

export const API_CONFIG = {
	BASE_URL: env.VITE_API_URL || "http://localhost:3000",
	TIMEOUT: 90000, // 90 seconds
	RETRY_ATTEMPTS: 3,
} as const;

export const MY_USER_ID = env.VITE_FIREBASE_USER_ID;
