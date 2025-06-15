import * as React from "react";

interface BreakpointConfig {
	sm: number;
	md: number;
	lg: number;
	xl: number;
	"2xl": number;
}

const BREAKPOINTS: BreakpointConfig = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1110,
	"2xl": 1536,
};

export function useBreakpoint(breakpoint: keyof BreakpointConfig) {
	const [isMatched, setIsMatched] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		const mql = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
		const onChange = () => setIsMatched(mql.matches);

		mql.addEventListener("change", onChange);
		setIsMatched(mql.matches);

		return () => mql.removeEventListener("change", onChange);
	}, [breakpoint]);

	return isMatched;
}

export function useIsMobile() {
	return !useBreakpoint("md");
}

export function useIsTablet() {
	const isAboveMd = useBreakpoint("md");
	const isBelowLg = !useBreakpoint("lg");
	return isAboveMd && isBelowLg;
}

export function useIsDesktop() {
	return useBreakpoint("lg");
}
