import environment from "@/config/environment";

type TReCaptchaResponse = {
	success: boolean;
	score: number;
};

const { siteKey, apiUrl } = environment.recaptcha;

export const getReCaptchaToken = async () => {
	try {
		if (!window.grecaptcha) {
			throw new Error("reCAPTCHA not loaded");
		}

		return await window.grecaptcha.execute(siteKey, { action: "submit" });
	} catch (error) {
		console.error("Failed to get reCAPTCHA token:", error);
		throw error;
	}
};

export const validateCaptchaToken = async (token: string) => {
	try {
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		});

		if (!response.ok) {
			throw new Error("Failed to validate reCAPTCHA token");
		}

		return (await response.json()) as TReCaptchaResponse;
	} catch (error) {
		console.error("reCAPTCHA validation failed:", error);
		throw error;
	}
};
