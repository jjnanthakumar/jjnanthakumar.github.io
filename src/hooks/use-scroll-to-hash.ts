import { useCallback, useEffect } from "react";
import { useLocation } from "react-router";

export const useScrollToHash = () => {
	const location = useLocation();

	const scrollToHash = useCallback(() => {
		if (location.hash) {
			const id = location.hash.replace("#", "");
			const el = document.getElementById(id);

			if (el) {
				el.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [location.hash]);

	useEffect(() => {
		scrollToHash();
	}, [scrollToHash]);

	return { scrollToHash };
};
