import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookOpenText, Circle, ListTree } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

interface Heading {
	id: string;
	text: string;
	level: number;
}

interface TableOfContentsProps {
	containerRef: React.RefObject<HTMLElement>;
	className?: string;
}

export const TableOfContents = ({ containerRef, className }: TableOfContentsProps) => {
	const location = useLocation();
	const navigate = useNavigate();

	const [headings, setHeadings] = useState<Heading[]>([]);
	const [activeId, setActiveId] = useState<string>("");
	const [maxHeight, setMaxHeight] = useState("calc(100vh - 240px)");

	// Update max height on mount and window resize
	useEffect(() => {
		const updateMaxHeight = () => {
			const viewportHeight = window.innerHeight;
			const offset = 240; // Adjust this value based on your layout
			setMaxHeight(`${viewportHeight - offset}px`);
		};

		updateMaxHeight();
		window.addEventListener("resize", updateMaxHeight);
		return () => window.removeEventListener("resize", updateMaxHeight);
	}, []);

	// Extract headings from content
	useEffect(() => {
		if (!containerRef.current) return;

		const elements = Array.from(containerRef.current.querySelectorAll("h2, h3, h4, h5, h6"));

		const headingElements = elements.map((element) => {
			// Add IDs to headings if they don't have one
			if (!element.id) {
				const id = element.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";
				element.id = id;
			}

			return {
				id: element.id,
				text: element.textContent || "",
				level: parseInt(element.tagName[1], 10),
			};
		});

		setHeadings(headingElements);
	}, [containerRef]);

	// Set up intersection observer for active heading
	useEffect(() => {
		if (!containerRef.current || headings.length === 0) return;

		const callback = (entries: IntersectionObserverEntry[]) => {
			// Find the heading that is most visible in the viewport
			const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

			if (visibleHeadings.length === 0) return;

			let bestHeading = visibleHeadings[0];
			visibleHeadings.forEach((heading) => {
				if (heading.intersectionRatio > bestHeading.intersectionRatio) {
					bestHeading = heading;
				}
			});

			setActiveId(bestHeading.target.id);
		};

		const observer = new IntersectionObserver(callback, {
			rootMargin: "0px 0px -80% 0px",
			threshold: [0.1, 0.5, 0.9],
		});

		const headingElements = headings
			.map((heading) => document.getElementById(heading.id))
			.filter(Boolean) as HTMLElement[];

		headingElements.forEach((element) => observer.observe(element));

		return () => {
			headingElements.forEach((element) => observer.unobserve(element));
		};
	}, [containerRef, headings]);

	// Scroll to heading when clicked
	const scrollToHeading = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			const offset = 90; // Account for navbar height
			const elementPosition = element.getBoundingClientRect().top + window.scrollY;
			window.scrollTo({
				top: elementPosition - offset,
				behavior: "smooth",
			});
			setActiveId(id);
			navigate(location.pathname + "#" + id, { replace: true });
		}
	};

	if (headings.length === 0) {
		return null;
	}

	return (
		<div className={cn("w-full", className)}>
			<div className="rounded-lg border bg-card p-4 shadow-sm animate-fade-in">
				<div className="flex items-center gap-2 font-medium text-lg mb-3">
					<BookOpenText size={18} className="text-primary" />
					<span>Table of Contents</span>
				</div>

				<ScrollArea className={`h-[${maxHeight}] overflow-hidden`}>
					<nav>
						<ul className="space-y-1 text-sm !pl-0">
							{headings.map((heading) => (
								<li
									key={heading.id}
									style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
									className="list-none"
								>
									<button
										onClick={() => scrollToHeading(heading.id)}
										className={cn(
											"text-left w-full py-1 px-2 rounded transition-colors hover:text-primary hover:bg-muted/50 flex items-start gap-1.5",
											activeId === heading.id
												? "text-primary font-medium bg-muted/50"
												: "text-muted-foreground",
										)}
									>
										{heading.level === 2 ? (
											<ListTree
												size={14}
												className={cn(
													"flex-shrink-0 mt-1",
													activeId === heading.id ? "text-primary" : "text-muted-foreground/60",
												)}
											/>
										) : (
											<Circle
												size={10}
												className={cn(
													"flex-shrink-0 mt-1",
													activeId === heading.id ? "text-primary" : "text-muted-foreground/60",
												)}
											/>
										)}
										<span className="line-clamp-2">{heading.text}</span>
									</button>
								</li>
							))}
						</ul>
					</nav>
				</ScrollArea>
			</div>
		</div>
	);
};
