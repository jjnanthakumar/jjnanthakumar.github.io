"use client";

import { useLoading } from "@/contexts/loading-context";
import { useCallback } from "react";

interface UseLoadingStateOptions {
	loadingText?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
	const { loadingText = "Loading..." } = options;
	const { isLoading, text, startLoading, stopLoading } = useLoading();

	const withLoading = useCallback(
		async <T>(
			fn: () => Promise<T>,
			options: {
				loadingText?: string;
				errorHandler?: (error: unknown) => void;
			} = {},
		): Promise<T | undefined> => {
			try {
				startLoading(options.loadingText || loadingText);
				const result = await fn();
				return result;
			} catch (error) {
				if (options.errorHandler) {
					options.errorHandler(error);
				} else {
					console.error("Error in withLoading:", error);
				}
				return undefined;
			} finally {
				stopLoading();
			}
		},
		[startLoading, stopLoading, loadingText],
	);

	return {
		isLoading,
		text,
		startLoading,
		stopLoading,
		withLoading,
	};
}
