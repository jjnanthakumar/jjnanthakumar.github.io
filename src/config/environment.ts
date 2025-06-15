export const environment = {
	firebase: {
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FIREBASE_APP_ID,
		measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
		databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
		userId: import.meta.env.VITE_FIREBASE_USER_ID,
	},
	recaptcha: {
		siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
		apiUrl: import.meta.env.VITE_RECAPTCHA_API_URL,
	},
	analytics: {
		umamiWebsiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
		umamiScriptUrl: import.meta.env.VITE_UMAMI_SCRIPT_URL,
	},
	app: {
		apiUrl: import.meta.env.VITE_API_URL,
		envProd: import.meta.env.VITE_APP_ENV === "production",
		envDev: import.meta.env.VITE_APP_ENV === "development",
		debug: import.meta.env.VITE_APP_DEBUG === "true",
	},
} as const;

// Type-safe environment variable validation
const validateEnv = () => {
	const required = ["VITE_FIREBASE_API_KEY", "VITE_RECAPTCHA_SITE_KEY"];

	const missing = required.filter((key) => !import.meta.env[key]);

	if (missing.length > 0) {
		throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
	}
};

// Call validation on app startup
validateEnv();

export default environment;
