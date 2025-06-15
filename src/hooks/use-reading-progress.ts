import { RefObject, useEffect, useState } from "react";

export function useReadingProgress(contentRef: RefObject<HTMLElement>) {
	const [readingProgress, setReadingProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (!contentRef.current) return;

			const element = contentRef.current;
			const totalHeight = element.clientHeight;
			const windowHeight = window.innerHeight;
			const scrollTop = window.scrollY - element.offsetTop + windowHeight / 2;

			const scrollPercent = (scrollTop / (totalHeight - windowHeight / 2)) * 100;
			setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [contentRef]);

	return readingProgress;
}
