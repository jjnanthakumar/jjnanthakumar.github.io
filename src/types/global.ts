// Initialize global types
declare global {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type TAny = any;
	interface Window {
		umami?: {
			track: (eventName: string, eventData?: Record<string, TAny>) => void;
		};
		grecaptcha?: {
			enterprise: TAny;
			ready: (callback: () => void) => void;
			execute: (siteKey: string, options?: { action: string }) => Promise<string>;
		};
	}
}
