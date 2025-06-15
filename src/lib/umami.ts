// Custom event tracking function
export const trackEvent = (eventName: string, eventData?: Record<string, TAny>) => {
	if (window.umami && import.meta.env.PROD) {
		window.umami.track(eventName, eventData);
	} else {
		console.log(`[DEV Analytics] Event: ${eventName}`, eventData || {});
	}
};
